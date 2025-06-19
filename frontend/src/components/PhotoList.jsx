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

import { Photo } from "./Photo"
import styles from "../styles/stylesForPhotoList.module.css"
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useRef, useCallback } from 'react';



    // Настраиваем повтор запросов (3 попытки с экспоненциальной задержкой)
    // axiosRetry(axios, {
    //     retries: 3, // Количество повторов
    //     retryDelay: (retryCount) => retryCount * 1000, // Задержка перед повтором (1s, 2s, 3s)
    //     retryCondition: (error) => {
    //         return error.response?.status >= 500 || error.code === 'ECONNABORTED';
    //     }
    // });
  
    // const handleSubmit = async () => {
    //     try {
    //         var url;
    //         if (tags) {
    //           url = `http://localhost:8080/api/photo/search/${tags}`
    //         } else {
    //           url = `http://localhost:8080/api/photo`
    //         }
    //         const response = await fetch(url, {
    //             method: 'GET',
    //         });
    //         const result = await response.json();
  
    //         // Update the state with the fetched data
    //         setData(result);
    //     } catch (error) {
    //         console.error('Error during the request:', error);
    //     }
    // }; СТАРОЕ РАБОЧЕЕ

export function PhotoList() {
    const { tags } = useParams();
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const size = 10;
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const lastPhotoRef = useCallback(node => {
        if (loading) return;
        
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && currentPage + 1 < totalPages) {
            handleSubmit(currentPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, currentPage, totalPages]);

    const handleSubmit = async (page = 0) => {
    if (loading) return;

    try {
        setLoading(true);
        let url = tags
        ? `http://localhost:8080/api/photo/search/${tags}`
        : `http://localhost:8080/api/photo?page=${page}&size=${size}`;

        const response = await fetch(url);
        const result = await response.json();

        if (!tags) {
        setData((prev) => [...prev, ...result.photos]);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
        } else {
        setData(result);
        }
    } catch (error) {
        console.error("Error during the request:", error);
    } finally {
        setLoading(false);
    }
    };

    const handleGoToPost = (id) => {
        navigate(`/post/${id}`);
    };
    
  
    useEffect(() => {
        if (!tags) {
            handleSubmit(0);
        } else {
            handleSubmit();
        }
    }, [tags]);

    return (
        <div className={styles.photoList}>
            {data.map((photo, index) => {
            const isLast = index === data.length - 1;
            return (
                <div
                onClick={() => handleGoToPost(photo.id)}
                key={photo.id}
                ref={isLast && !tags ? lastPhotoRef : null}
                >
                <Photo photo={photo} />
                </div>
            );
            })}
            {loading && <p className={styles.loading}>Загрузка...</p>}
        </div>
    );
}
