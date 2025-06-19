import styles from "../styles/stylesForPost.module.css"
import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




export function Post() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [albums, setAlbums] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
  const { idPost } = useParams();
  const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState("");
const [isFullscreen, setIsFullscreen] = useState(false);

  const [media, setMedia] = useState(null); // { type: 'image' | 'video', src: string }
  const [photoInfo, setPhotoInfo] = useState({ name: "", tags: "", description: "", username: "" });

  const handleGetPost = useCallback(() => {
    return fetch(`http://localhost:8080/api/photo/getPost/${idPost}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(photo => {
        setPhotoInfo({
          name: photo.name,
          tags: photo.tags,
          description: photo.description,
          username: photo.username
        });
  
        // Используем contentType напрямую
        const isVideo = photo.type.startsWith("video");
  
        setMedia({
          type: isVideo ? "video" : "image",
          src: `data:${photo.type};base64,${photo.image}`
        });
      })
      .catch(error => {
        console.error('Error fetching photo:', error);
      });
  }, [idPost]);



const navigate = useNavigate();


const fetchUserAlbums = async (userId) => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) return;

    try {
        const response = await fetch(`http://localhost:8080/api/album/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        if (!response.ok) throw new Error("Ошибка при получении альбомов");
        const result = await response.json();
        setAlbums(result);
    } catch (error) {
        console.error("Ошибка при загрузке альбомов:", error);
    }
};


const [isYourPhoto, setIsYourPhoto] = useState(false); 
const handleDelete = async () => {
  try {
    const accessToken = localStorage.getItem('token');
        if (!accessToken) {
            console.error('Access token is missing');
            return;
        }

        // Добавляем токен в заголовок запроса
        const headers = {
            'Authorization': 'Bearer ' + accessToken
        };

    const response = await fetch(`http://localhost:8080/api/photo/${idPost}`, {
      method: 'DELETE',
      headers: headers
    });

    if (response.ok) {

      // Перенаправление пользователя после успешного удаления
      navigate(`/`);
    } else {
      console.error('Failed to delete photo. HTTP status:', response.status);
    }
  } catch (error) {
    console.error('Error during delete request:', error);
  }
};

const fetchComments = async () => {
  try {
    const res = await fetch(`http://localhost:8080/api/comment/${idPost}`);
    const data = await res.json();

    // Массив промисов, чтобы получить username по каждому userId
    const commentsWithUsernames = await Promise.all(
  data.map(async (comment) => {
    try {
      const usernameRes = await fetch(`http://localhost:8080/api/photo/getUsername/${comment.userId}`);
      const username = await usernameRes.text();

      // Попробуем распарсить comment.text, если это строка в формате JSON
      let parsedText = comment.text;
      try {
        const maybeParsed = JSON.parse(comment.text);
        if (maybeParsed && typeof maybeParsed.text === 'string') {
          parsedText = maybeParsed.text;
        }
      } catch (e) {
        // не JSON — оставим как есть
      }

      return {
        ...comment,
        text: parsedText,
        username
      };
    } catch (e) {
      console.error("Ошибка при получении имени пользователя:", e);
      return {
        ...comment,
        username: "Неизвестный пользователь"
      };
    }
  })
);

    setComments(commentsWithUsernames);
    console.log("Комментарии с именами:", commentsWithUsernames);
  } catch (err) {
    console.error("Ошибка при загрузке комментариев:", err);
  }
};

const handleAddComment = async () => {
  if (newComment.trim() === "") return;
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Нужно авторизоваться, чтобы комментировать публикации.");
    return;
  }
  try {
    const res = await fetch(`http://localhost:8080/api/comment/${idPost}`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: newComment })
    });

    if (res.ok) {
      setNewComment("");
      fetchComments(); // обновить после отправки
    }
  } catch (err) {
    console.error("Ошибка при отправке комментария:", err);
  }
};

const handleGoToUser = async () => {
  try {
    const username = photoInfo.username.replace('Автор: ', '');
    const res = await fetch(`http://localhost:8080/api/auth/getuserid/${username}`);
    if (res.ok) {
      const userId = await res.text();
      navigate(`/user/${userId}`);
    }
  } catch (e) {
    console.error('Error navigating to user:', e);
  }
};

const handleCheckOwnership = useCallback(() => {
  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
      console.error('Access token is missing');
      return;
  }

  // Добавляем токен в заголовок запроса
  const headers = {
      'Authorization': 'Bearer ' + accessToken
  };

  fetch(`http://localhost:8080/api/photo/isityourphoto/${idPost}`, {
      headers: headers
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(result => {
          setIsYourPhoto(result); // Обновляем состояние в соответствии с результатом проверки
      })
      .catch(error => {
          console.error('Error checking photo ownership:', error);
      });
}, [idPost]);



const [likes, setLikes] = useState(0);
const [isLiked, setIsLiked] = useState(false);
const handleLike = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Нужно авторизоваться, чтобы ставить лайки.");
    return;
  }

  try {
    const method = isLiked ? 'DELETE' : 'POST';
    const res = await fetch(`http://localhost:8080/api/like/${idPost}`, {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (res.ok) {
      setIsLiked(!isLiked);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
    }
  } catch (err) {
    console.error("Ошибка при обработке лайка:", err);
  }
};

const fetchLikes = async () => {
  try {
    const res = await fetch(`http://localhost:8080/api/like/count/${idPost}`);
    const count = await res.json();
    setLikes(count);

    const token = localStorage.getItem("token");
    if (!token) return;

    const likedRes = await fetch(`http://localhost:8080/api/like/isLiked/${idPost}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (likedRes.ok) {
      const isLiked = await likedRes.json();
      setIsLiked(isLiked);
    }
  } catch (err) {
    console.error("Ошибка при получении лайков:", err);
  }
};


const handleAddToAlbumById = async (albumId) => {
  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    console.error('Access token is missing');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/album/${albumId}/addPhoto?photoId=${idPost}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    if (response.ok) {
      alert("Фотография успешно добавлена в альбом!");
      setShowDropdown(false);
    } else {
      console.error('Ошибка при добавлении в альбом:', response.status);
      alert("Не удалось добавить фото в альбом.");
    }
  } catch (error) {
    console.error('Ошибка сети при добавлении фото:', error);
    alert("Ошибка подключения.");
  }
};



const [userId, setUserId] = useState(null);

const fetchUserDetails = async () => {
  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    setIsAuthenticated(false);
    return;
  }

  setIsAuthenticated(true); // ← пользователь авторизован

  try {
    const response = await fetch('http://localhost:8080/api/auth/getuserdetails', {
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });

    if (!response.ok) throw new Error('Ошибка при получении пользователя');
    const result = await response.json();
    setUserId(result.id);
    fetchUserAlbums(result.id); // вызываем здесь
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
  }
};

useEffect(() => {
  window.scrollTo(0, 0);
  handleGetPost();
  handleCheckOwnership();
  fetchUserDetails();
  fetchLikes();
  fetchComments();
}, [handleGetPost, handleCheckOwnership]);

    return (
        <div className={styles.upload}>
            <form method="get" className={styles.formUpload} id="form" encType="multipart/form-data">
        <div className={styles.header1Container}>
          <div className={styles.header1}>{photoInfo.name}</div>
        </div>
        <div className={styles.gridTable}>
          <div id="photoContainer" className={styles.photoInputContainer}>
            {/* {media && media.type === "image" && (
              <img src={media.src} alt="img" />
            )} */}

            {media && media.type === "image" && (
  <>
    {!isFullscreen && (
  <img
      src={media.src}
      alt="img"
      onClick={() => setIsFullscreen(true)}
      className={isFullscreen ? styles.fullscreenImage : styles.unfullscreenImage}
      style={{ cursor: 'zoom-in' }}
    />
)}
    
    {isFullscreen && (
      <div className={styles.fullscreenOverlay}>
        <button className={styles.closeButton} onClick={() => setIsFullscreen(false)}>✕</button>
        <img src={media.src} alt="img" className={styles.fullscreenContent} />
      </div>
    )}
  </>
)}
            {media && media.type === "video" && (
              <video controls>
                <source src={media.src} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            )}
          </div>

          <div className={`${styles.inputboxes} ${styles.tags}`}>{photoInfo.tags}</div>
          <div className={styles.note}>{photoInfo.description}</div>
          <div
            className={`${styles.inputboxes} ${styles.username}`}
            onClick={handleGoToUser}
          >
            Автор: {photoInfo.username}
          </div>
          <div id="username" className={`${styles.inputboxes} ${styles.username}`} onClick={handleGoToUser}></div>

        </div>
      </form>
            {/* Кнопка "Удалить публикацию", отображаемая в зависимости от результата проверки принадлежности фотографии */}
      



          <div className={styles.btnSubmitContainer}>
            <button className={`${styles.btnSubmit} ${styles.like} ${isLiked ? styles.liked : styles.unliked}`} onClick={handleLike}>
  ❤️ {likes}
</button>
            {/* <button className={`${styles.btnSubmit} ${styles.addInAlbum}`} onClick={handleAddToAlbum}>
  Добавить в альбом
</button> */}
{isAuthenticated && (
  <div className={styles.dropdownContainer}>
    <button className={`${styles.btnSubmit} ${styles.addInAlbum}`} onClick={() => setShowDropdown(prev => !prev)}>
      Добавить в альбом
    </button>
    {showDropdown && (
      <ul className={styles.dropdownList}>
        {albums.map(album => (
          <li key={album.id} onClick={() => handleAddToAlbumById(album.id)} className={styles.dropdownItem}>
            {album.name}
          </li>
        ))}
      </ul>
    )}
  </div>
)}

            {isYourPhoto && (
              <button className={`${styles.btnSubmit} ${styles.delete}`} onClick={handleDelete}>Удалить публикацию</button>
            )}
          </div>

          <div className={styles.header4Container}>
            <div className={styles.header4}><div>Комментарии</div></div>
          </div>
          
          
          
            
          <div className={styles.commentContainer}>
            {comments.map((comment, index) => (
              <div key={index} className={styles.comment}>
                <strong>{comment.username}</strong>: {comment.text}
              </div>
            ))}
          </div>
            
          

          <div className={styles.commentInputContainer}>
            <textarea
              className={styles.inputboxes}
              placeholder="Оставить комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className={styles.btnSubmit} onClick={handleAddComment}>Отправить</button>
          </div>
        </div>
    )
}