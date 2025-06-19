import React, { useEffect, useCallback, useState } from 'react';
import styles from "../styles/stylesForPhoto.module.css"
import LikeButton from "../images/blackheart.png"
import UnlikeButton from "../images/pinkheart1.png"


export function Photo({ photo }) {
    
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState("image"); // "image" | "video"
    const [liked, setLiked] = useState(false); // Состояние для отображения, лайкнута ли публикация
  const [isLoading, setIsLoading] = useState(true); // Состояние для загрузки данных о лайке
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
      // const [liked, setLiked] = useState(false);
  // const [count, setCount] = useState(0);

  // const toggleLike = () => {
  //   setLiked(prev => !prev);
  //   setCount(prev => prev + (liked ? -1 : 1));
  // };

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

  // Используем useEffect для вызова функций при монтировании компонента
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
        <div className={styles.containerOfPhoto}>
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
            </div>
            
            
        </div>
    )
}