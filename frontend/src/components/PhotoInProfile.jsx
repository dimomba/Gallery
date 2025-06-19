// import React, { useEffect, useCallback } from 'react';
// import styles from "../styles/stylesForPhotoInprofile.module.css"
// // import { LikeButton } from "./LikeButton"

// export function PhotoInprofile({ photo }) {
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

    
    
//       useEffect(() => {
//         handleGetFields();
//         handleGetImage(photo.id);
//       }, [handleGetFields, handleGetImage, photo.id]);
            


//     return (
//       <div className={styles.containerOfPhoto}>
//         <img src={photo.url} alt="" className={styles.photo} id={`image_${photo.id}`} />
//         <div className={styles.containerOfName} id={`name_${photo.id}`}></div>
//       </div>
//     )
// }

import React, { useEffect, useCallback, useState } from 'react';
import styles from "../styles/stylesForPhotoInprofile.module.css";

export function PhotoInprofile({ photo }) {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState("image"); // "image" | "video"

  const handleGetFields = useCallback(() => {
    const nameElement = document.getElementById(`name_${photo.id}`);
    nameElement.textContent = photo.name;
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

  useEffect(() => {
    handleGetFields();
    handleGetImage(photo.id);
  
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
    // ⛔ НЕ включаем mediaUrl в зависимости!
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
      <div className={styles.containerOfName} id={`name_${photo.id}`}></div>
    </div>
  );
}