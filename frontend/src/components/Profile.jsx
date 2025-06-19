import styles from "../styles/stylesForProfile.module.css"
import React, { useState, useEffect } from 'react';
import { PhotoInprofile } from "./PhotoInProfile"
import { useNavigate, useParams } from 'react-router-dom';

export function Profile() {
    const { user_id } = useParams();
    const [data, setData] = useState([]);
    const [username, setUsername] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    console.log(user_id);
    
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
    
    const handleGetAllUserPhotos = async () => {
        try {
            var url;
            if (user_id) {
              url = `http://localhost:8080/api/photo/searchbyuserid/${user_id}`
            } else {
                return
            }
            const response = await fetch(url, {
                method: 'GET',
            });
            const result = await response.json();
  
            // Update the state with the fetched data
            setData(result);
        } catch (error) {
            console.error('Error during the request:', error);
        }
    };

    const handleGoToPost = (id) => {
        navigate(`/post/${id}`);
    };

    const handleGetUsername = async () => {
        //console.log("handleGetUsername called");
        try {
            if (!user_id) return;
    
            const url = `http://localhost:8080/api/photo/getUsername/${user_id}`;
            const response = await fetch(url, {
                method: 'GET',
            });
    
            const result = await response.text(); // <- используем text(), а не json()
            setUsername(result); // <- устанавливаем строку
    
        } catch (error) {
            console.error('Error during the request:', error);
        }
    };

    const handleFollowToggle = () => {
        setIsFollowing(prev => !prev); // переключение состояния
        // Здесь можно добавить запрос к серверу, чтобы сохранить подписку
    };

        const handleGoToAlbum = (albumId) => {
    navigate(`/album/${albumId}`);
};
  
    useEffect(() => {
        // Fetch data when the component mounts
        if (user_id) {
            handleGetAllUserPhotos();
            handleGetUsername();
            fetchUserAlbums(user_id);
        }
    }, [user_id]);

    return (
        <div className={styles.registration}>
            <div className={styles.table1}>
                <div className={styles.header2Container}>
                    <div>
                        <div className={styles.header2}>{username}</div>
                    </div>
                </div>
                <div className={styles.header3Container}>
                    <button className={styles.header3} onClick={handleFollowToggle}>
                        {isFollowing ? 'Отписаться' : 'Подписаться'}
                    </button>
                </div>
                {/* <div className={styles.header2Container}>
                    <div>
                        <div className={styles.header2}>Добавить себе</div>
                    </div>
                </div>*/}
            </div>
            <div className={styles.photoList}>
                
                <div className={styles.header11Container}>
                    <div className={styles.header1}>Публикации</div>
                </div>

                <div className={styles.header12Container}>
                    <div className={styles.header1}>Альбомы</div>
                </div>
                
                {albums.map(album => (
    <div className={styles.album} key={album.id} onClick={() => handleGoToAlbum(album.id)}>
    <div className={styles.nameOfAlbum}>{album.name}</div>
    
</div>
))}
                
                {data.map(photo => (
                    <div onClick={() => handleGoToPost(photo.id)} key={photo.id} className={styles.publication}>
                        <PhotoInprofile photo={photo} />
                    </div>
                ))}

            </div>
        </div>
    )
}
