import styles from "../styles/stylesForUpload.module.css"
import React, { useState, useEffect } from 'react';
import axios from 'axios';


export function Upload() {
    const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // Проверяем, есть ли предварительно сохраненное изображение
    if (!imageSrc) {
      // Если нет, устанавливаем пустую строку или другое значение по умолчанию
      setImageSrc(''); 
    }
  }, [imageSrc]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const newImageSrc = reader.result;
        setImageSrc(newImageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  

  const[name, setName]=useState('');
  const[tags, setTags]=useState('');
  const[description, setDescription]=useState('');
  const [file, setFile] = useState(null);



  const handleClick = async (e) => {
    e.preventDefault();

    try {
        // Получаем токен доступа из localStorage
        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
            console.error('Access token is missing');
            return;
        }

        // Добавляем токен в заголовок запроса
        const headers = {
            'Authorization': 'Bearer ' + accessToken
        };

        const response = await fetch('http://localhost:8080/api/auth/getuserid', {
            method: 'GET',
            headers: headers
        });
        const result = await response.text();


        // Теперь отправляем POST-запрос после получения user_id
        const formData = new FormData();
        formData.append('name', name);
        formData.append('tags', tags);
        formData.append('description', description);
        formData.append('user_id', result); // Используем полученный user_id
        formData.append('file', file);

        const postResponse = await axios.post('http://localhost:8080/api/photo', formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            },
        });

        // Обработка успешного ответа от сервера
        const data = postResponse.data;
        var form = document.getElementById('form');
        form.submit();
    } catch (error) {
        // Обработка ошибки
        console.error('Error:', error);
    }
};

  // const handleClick = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('tags', tags);
  //   formData.append('description', description);
  //   formData.append('file', file);
  //   try {
  //     // Получаем токен доступа из localStorage
  //     const accessToken = localStorage.getItem('token');
  //     console.log(accessToken)
  //     if (!accessToken) {
  //       console.error('Access token is missing');
  //       return;
  //   }
  //     // Добавляем токен в заголовок запроса
  //     const headers = {
  //         'Authorization': 'Bearer ' + accessToken
  //     };
  //     console.log(accessToken);

  //     const response = await fetch('http://localhost:8080/api/auth/getuserid', {
  //         method: 'GET',
  //         headers: headers
  //     });
  //     const result = await response.text();

  //     console.log("Fetch User ID result:", result); // Выводим результат запроса в консоль

  //     setUserId(result);
  //     // Log the entire response object
  //     console.log(response);
  //     console.log(result);
  // } catch (error) {
  //     console.error('Error during the request:', error);
  // }
  // formData.append('user_id', user_id);
  //   try {
  //     const response = await axios.post('http://localhost:8080/api/photo', formData, {
  //       headers: {
  //         'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
  //       },
  //     });

  //     // Обработка успешного ответа от сервера
  //     const data = response.data;
  //     console.log(data);
  //     var form = document.getElementById('form');
  //     form.submit();
  //   } catch (error) {
  //     // Обработка ошибки
  //     console.error('Error:', error);
  //   }
  // };
    return (
        <div className={styles.upload}>
            <form method="get" className={styles.formUpload} id="form" encType="multipart/form-data" onSubmit={handleClick}>
                <div className={styles.header1Container}>
                    <div className={styles.header1}>Создание публикации</div>
                </div>
                <div className={styles.gridTable}>
                    <div className={styles.header2}>Выберите изображение</div>

                    <div className={styles.photoInputContainer}>
                        {imageSrc && file?.type.startsWith("image") && (
                            <img src={imageSrc} alt="Загружено" />
                        )}
                        {imageSrc && file?.type.startsWith("video") && (
                            <video src={imageSrc} controls style={{ maxWidth: "100%", maxHeight: "80%" }} />
                        )}

                        <label for="inputField" className={styles.labelForButtonFile}>Выбрать файл</label>
                        <input type="file" id="inputField" accept="image/png, image/jpg, image/jpeg, video/mp4" className={styles.inputField} onChange={handleImageChange} required />
                    </div>

                    <input type="text" placeholder="Название *" className={`${styles.inputboxes} ${styles.name}`} required 
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />

                    <input type="text" placeholder="Теги *" className={`${styles.inputboxes} ${styles.tags}`} required 
                    value={tags}
                    onChange={(e)=>setTags(e.target.value)}
                    />

                    <textarea placeholder="Описание" cols="100" rows="10" className={styles.note}
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}>
                    </textarea>
                </div>

                <div className={styles.btnSubmitContainer}>
                    <button type="submit" className={styles.btnSubmit}>Опубликовать</button>
                </div>
            </form>
        </div>
    )
}
