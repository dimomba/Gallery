// import React, { useEffect, useCallback, useState } from 'react';
// import styles from "../styles/stylesForPhotoInAlbum.module.css"
// import LikeButton from "../images/blackheart.png"
// import TrashButton from "../images/trashIcon.png"


// export function PhotoInAlbum({ photo }) {
//     const handleGetFields = useCallback(() => {
//         const nameElement = document.getElementById(`name_${photo.id}`);
//         nameElement.textContent = photo.name;
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//       }, [photo.id]);
    
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//       const handleGetImage = async (id) => {
//         try {
//           const response = await fetch(`http://localhost:8080/api/photo/getImage/${id}`);
//           const blob = await response.blob();
      
//           const imageUrl = URL.createObjectURL(blob);
//           const imageElement = document.getElementById(`image_${id}`);
//           imageElement.src = imageUrl;
//         } catch (error) {
//           console.error('Error fetching image:', error);
//         }
//       };
//       const [liked, setLiked] = useState(false);
//   const [count, setCount] = useState(0);

//   const toggleLike = () => {
//     setLiked(prev => !prev);
//     setCount(prev => prev + (liked ? -1 : 1));
//   };


    
    
//       useEffect(() => {
//         handleGetFields();
//         handleGetImage(photo.id);
//       }, [handleGetFields, handleGetImage, photo.id]);
            


//     return (
//         <div className={styles.containerOfPhoto}>
//             <img src={photo.url} alt="" className={styles.photo} id={`image_${photo.id}`} />
            
//             <div className={styles.containerOfString}>
//               <div className={styles.containerOfName} id={`name_${photo.id}`}></div>
//               <div className={styles.containerOfLikeButton}>
//                 <img src={LikeButton} alt=""  className={`${styles.likeButton} ${liked ? styles.liked : ''}`} onClick={toggleLike} />
//               </div>
//               <div className={styles.containerOfDeleteButton}>
//                 <img
//                     src={TrashButton}
//                     alt="Удалить фото из альбома"
//                     className={styles.deleteButton}
//                 />
//             </div>
//             </div>
            
            
//         </div>
//     )
// }


import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from "react-router-dom";
import styles from "../styles/stylesForPhotoInAlbum.module.css";
import LikeButton from "../images/blackheart.png";
import TrashButton from "../images/trashIcon.png";
import UnlikeButton from "../images/pinkheart1.png"

export function PhotoInAlbum({ photo }) {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState("image"); // "image" | "video"
  const [liked, setLiked] = useState(false); // Состояние для отображения, лайкнута ли публикация
  const [isLoading, setIsLoading] = useState(true); // Состояние для загрузки данных о лайке
  const { idAlbum } = useParams();

  

  const handleGetFields = useCallback(() => {
    const nameElement = document.getElementById(`name_${photo.id}`);
    if (nameElement) {
      nameElement.textContent = photo.name;
    }
  }, [photo.id, photo.name]);

  const handleGetImage = useCallback(async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/photo/getImage/${id}`);
      const contentType = response.headers.get("Content-Type");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      setMediaUrl(objectUrl);

      if (contentType && contentType.startsWith("video")) {
        setMediaType("video");
      } else {
        setMediaType("image");
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  }, []);

  const toggleLike = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Нужно авторизоваться, чтобы ставить лайки.");
    return;
  }

  try {
    const method = liked ? 'DELETE' : 'POST';
    const res = await fetch(`http://localhost:8080/api/like/${photo.id}`, {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });

    if (res.ok) {
      setLiked(!liked); // Переключаем состояние лайка
    }
  } catch (err) {
    console.error("Ошибка при обработке лайка:", err);
  }
};


    
    
    // Функция для проверки, лайкнута ли публикация
  const checkIfLiked = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:8080/api/like/isLiked/${photo.id}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });

      if (res.ok) {
        const liked = await res.json();
        setLiked(liked); // Устанавливаем состояние в зависимости от того, лайкнута ли публикация
      }
    } catch (error) {
      console.error("Error checking like status:", error);
    } finally {
      setIsLoading(false); // Завершаем загрузку после получения данных
    }
  };

  const handleRemovePhotoFromAlbum = async () => {
  const token = localStorage.getItem("token");
  console.log(idAlbum);
  if (!token) {
    alert("Нужно авторизоваться для удаления.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/album/${idAlbum}/removePhoto?photoId=${photo.id}`, {
      method: "DELETE",
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    window.location.reload();
    

    if (res.status === 204 && typeof photo.onPhotoRemoved === 'function') {
      photo.onPhotoRemoved(photo.id);
    }
  } catch (err) {
    console.error("Ошибка при удалении из альбома:", err);
  }
};

  useEffect(() => {
    handleGetFields();
    handleGetImage(photo.id);
    checkIfLiked();
  
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [handleGetFields, handleGetImage, photo.id]);

  return (
    <div className={styles.containerOfPhoto} id={`photo_${photo.id}`}>
      {mediaType === "image" && mediaUrl && (
        <img src={mediaUrl} alt="media" className={styles.photo} id={`image_${photo.id}`} />
      )}
      {mediaType === "video" && mediaUrl && (
        <video controls className={styles.photo} id={`image_${photo.id}`}>
          <source src={mediaUrl} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      )}

      <div className={styles.containerOfString}>
        <div className={styles.containerOfName} id={`name_${photo.id}`}></div>
        <div className={styles.containerOfLikeButton}>
          {/* Загрузка и отображение иконки лайка */}
          {isLoading ? (
            <div></div> // Выводим сообщение о загрузке, если данные еще не получены
          ) : (
            <img 
              src={liked ? UnlikeButton : LikeButton}  
              alt="like"  
              className={styles.likeButton} 
              onClick={(e) => {
    e.stopPropagation(); // предотвращаем всплытие события
    toggleLike();        // переключаем лайк
  }}// Эта функция будет переключать лайк
            />
          )}
        </div>
        <div className={styles.containerOfDeleteButton}>
          <img
            src={TrashButton}
            alt="Удалить фото из альбома"
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              handleRemovePhotoFromAlbum();
            }}
          />
        </div>
      </div>
    </div>
  );
}
