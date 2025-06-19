// import { Photo } from "./Photo"
// import "../styles/stylesForPhotoList.css"
// import { useParams } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';


// export function PhotoList() {
//     const { tags } = useParams();
//   const [data, setData] = useState([]);
//   const navigate = useNavigate();
  
//   const handleSubmit = async (e) => {
//     // Добавляем проверку на существование объекта e
//     e && e.preventDefault();
  
//     try {
//       const response = await fetch(`http://localhost:8080/api/photo/search/${tags}`);
//       const result = await response.json();
  
//       // Log the entire response object
//       console.log(response);
//       console.log(result);
  
//       // Update the state with the fetched data
//       setData(result);
//     } catch (error) {
//       console.error('Error during the request:', error);
//     }
//   };

//   const handleGoToPost = (id) => {
//     navigate(`/post/${id}`);
//   };
  
//   useEffect(() => {
//     // Fetch data when the component mounts
//     handleSubmit();
//   }, [tags]);

//     return (
//         <div className="photoList">
//             {data.map(photo => (
//                 <div onClick={() => handleGoToPost(photo.id)}>
//                     <Photo key={photo.id} photo={photo} />
//                 </div>
//             ))}
//     </div>
//     )
// }

import { PhotoInAlbum } from "./PhotoInAlbum"
import { Photo } from "./Photo"
import styles from "../styles/stylesForAlbum.module.css"
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export function Album() {
    const { idAlbum } = useParams();
    const [albumName, setAlbumName] = useState('');
    const [isAlbumOwner, setIsAlbumOwner] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [isOwned, setIsOwned] = useState(true);
    const [isPublic, setIsPublic] = useState(false);

    // Настройка повторов для axios
    axiosRetry(axios, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
        retryCondition: error => error.response?.status >= 500 || error.code === 'ECONNABORTED',
    });

    const checkAlbumOwnership = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`http://localhost:8080/api/album/isityouralbum/${idAlbum}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error("Ошибка проверки владения альбомом");
        const result = await response.json(); // true или false
        setIsAlbumOwner(result);
    } catch (error) {
        console.error("Ошибка при проверке владельца альбома:", error);
    }
};


const fetchAlbumName = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/album/${idAlbum}/name`);
            setAlbumName(response.data); // Сохраняем имя альбома
        } catch (error) {
            console.error('Ошибка при загрузке имени альбома:', error);
        }
    };

    const fetchAlbumPhotos = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/album/${idAlbum}`);
            setData(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке фотографий альбома:', error);
        }
    };

    const handleDeleteAlbum = async () => {
        const confirmed = window.confirm("Вы уверены, что хотите удалить этот альбом?");
        if (!confirmed) return;

        const accessToken = localStorage.getItem('token');
        if (!accessToken) return;

        try {
            const response = await fetch(`http://localhost:8080/api/album/${idAlbum}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });

            if (!response.ok) {
                throw new Error("Ошибка при удалении альбома");
            }

            // Перенаправляем назад, например, на страницу профиля
            navigate("/my");

        } catch (error) {
            console.error("Не удалось удалить альбом:", error);
        }
    };

    const handleGoToPost = (id) => {
        navigate(`/post/${id}`);
    };

    const handleAddToMyAlbums = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`http://localhost:8080/api/album/${idAlbum}/copy`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

        if (!response.ok) throw new Error("Ошибка при копировании альбома");

        const result = await response.json();
        alert("Альбом добавлен в ваши альбомы");
        navigate(`/album/${result.id}`); // Переход к новому альбому
    } catch (error) {
        console.error("Не удалось добавить альбом:", error);
    }
};

    useEffect(() => {
    fetchAlbumName();
    fetchAlbumPhotos();
    checkAlbumOwnership();
}, [idAlbum]);

    return (
        <div>
            <div className={styles.header1Container}>
                <div className={styles.header1}>{albumName ? ` ${albumName}` : 'Альбом'}</div>
            </div>

            <div className={styles.table1}>
    {isAlbumOwner ? (
        <>
            <div className={styles.header2Container}>
                <button className={styles.header2} onClick={handleDeleteAlbum}>
                    Удалить альбом
                </button>
            </div>
            <div className={styles.header3Container}>
                <button className={styles.header3} onClick={() => setIsPublic(prev => !prev)}>
                    {isPublic ? "Сделать приватным" : "Сделать публичным"}
                </button>
            </div>
        </>
    ) : (
        <div className={styles.header2Container}>
            <button className={styles.header2} onClick={handleAddToMyAlbums}>
                Добавить к себе
            </button>
        </div>
    )}
</div>

            <div className={styles.photoList}>
                {data.map(photo => (
                    <div onClick={() => handleGoToPost(photo.id)} key={photo.id}>
                        {isAlbumOwner ? (
                            <PhotoInAlbum photo={photo} />
                            ) : (
                            <Photo photo={photo} />
                            )}
                    </div>
                ))}
            </div>
        </div>
    );
}