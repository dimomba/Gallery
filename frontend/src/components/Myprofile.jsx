import styles from "../styles/stylesForProfileWithAlbums.module.css"
import React, { useState, useEffect } from 'react';
import { PhotoInprofile } from "./PhotoInProfile"
import { useNavigate } from 'react-router-dom';
import TrashButton from "../images/trashIcon.png"

export function Myprofile() {
    const [userDetails, setUserDetails] = useState(null);

    const [albums, setAlbums] = useState([]);

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

    useEffect(() => {
        const handleGetUserdetails = () => {
            const accessToken = localStorage.getItem('token');
        if (!accessToken) {
            console.error('Access token is missing');
            return;
        }
      
        // Добавляем токен в заголовок запроса
        const headers = {
            'Authorization': 'Bearer ' + accessToken
        };
      
        fetch(`http://localhost:8080/api/auth/getuserdetails`, {
            headers: headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                setUserDetails(result); 
                console.log(result);// Обновляем состояние в соответствии с результатом проверки
            })
            .catch(error => {
                console.error('Error checking photo ownership:', error);
            });
        }
    
        handleGetUserdetails();
    }, []);

    const user_id = userDetails ? userDetails.id : null;
    const [data, setData] = useState([]);
    const navigate = useNavigate();
  
    const handleGetAllUserPhotos = async () => {
        try {
            var url;
            console.log(user_id);
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
  
    useEffect(() => {
    if (user_id) {
        handleGetAllUserPhotos();
        fetchUserAlbums(user_id); // ← вот это добавляем
    }
}, [user_id]);


    const handleLogout = () => {
        // Удаление элементов token и username из localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        sessionStorage.setItem('pageReloaded', false);
    };

    const handleCreateAlbum = async () => {
    const albumName = prompt("Введите название альбома:");
    if (!albumName || !user_id) return;

    try {
        const response = await fetch(`http://localhost:8080/api/album/album`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({
        userId: user_id,
        name: albumName
    })
});

        if (!response.ok) {
            throw new Error("Ошибка при создании альбома");
        }

        const newAlbum = await response.json();
        // Опционально: добавим имя, которое ввёл пользователь
        newAlbum.name = albumName;

        await fetchUserAlbums(user_id);
    } catch (error) {
        console.error("Не удалось создать альбом:", error);
    }
};

    const handleGoToAlbum = (albumId) => {
    navigate(`/album/${albumId}`);
};

    const handleDeleteAlbum = async (albumId) => {
    const confirmed = window.confirm("Вы уверены, что хотите удалить этот альбом?");
    if (!confirmed) return;

    const accessToken = localStorage.getItem('token');
    if (!accessToken) return;

    try {
        const response = await fetch(`http://localhost:8080/api/album/${albumId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });

        if (!response.ok) {
            throw new Error("Ошибка при удалении альбома");
        }

        // Обнови список альбомов после удаления
        setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== albumId));
    } catch (error) {
        console.error("Не удалось удалить альбом:", error);
    }
};

    return (
        <div className={styles.registration}>
            <form method="get" className={styles.formRegistration}>
                <div className={styles.header1Container}>
                    <div className={styles.header1}>Мои данные</div>
                </div>
                <div className={styles.gridTable}>

                    {userDetails && (
                        <div className={styles.gridTable}>
                            <div className={styles.stringContainer}>
                                <div className={styles.nameOfInput}>Имя пользователя:</div>
                                <input type="text" value={userDetails.username} placeholder="Имя *" className={`${styles.inputboxes} ${styles.name}`} required disabled />
                            </div>
                            <div className={styles.stringContainer}>
                                <div className={styles.nameOfInput}>Эл. почта:</div>
                                <input type="text" value={userDetails.email} placeholder="Адрес электронной почты *" className={`${styles.inputboxes} ${styles.email}`} required disabled />
                            </div>
                        </div>
                    )}

                </div>

                {/* <br></br>
                <div className={styles.btnSubmitContainer}>
                    <div className={styles.loginBtnContainer}><a href="/editProfile" className={styles.loginBtn}>Редактировать профиль</a></div>
                </div> */}

                <br></br>
                <div className={styles.btnSubmitContainer}>
                    <div className={styles.loginBtnContainer}><a onClick={handleLogout} href="/" className={styles.loginBtn}>Выйти из профиля</a></div>
                </div>
            </form>
            <div className={styles.photoList}>
                
                <div className={styles.header11Container}>
                    <div className={styles.header1}>Публикации</div>
                </div>

                <div className={styles.header12Container}>
                    <div className={styles.table1}>
                        <div className={styles.header2Container}>
                            <div>
                                <div className={styles.header2}>Альбомы</div>
                            </div>
                        </div>
                        <div className={styles.header3Container}>
                            <button className={styles.header3} type="button" onClick={handleCreateAlbum}>
    Создать
</button>
                        </div>
                    </div>
                    {/* <div className={styles.header1}>Альбомы</div> */}
                </div>

                
                {albums.map(album => (
    <div className={styles.album} key={album.id} onClick={() => handleGoToAlbum(album.id)}>
    <div className={styles.nameOfAlbum}>{album.name}</div>
    <div className={styles.containerOfLikeButton} onClick={(e) => e.stopPropagation()}>
        <img
            src={TrashButton}
            alt="Удалить альбом"
            className={styles.likeButton}
            onClick={() => handleDeleteAlbum(album.id)}
        />
    </div>
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
