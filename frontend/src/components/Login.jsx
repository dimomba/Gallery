// import styles from "../styles/stylesForRegistration.module.css"
// import logo from "../images/logo.png"
// import galleryString from "../images/galleryString.png"


// export function Login() {
//     return (
//         <div className={styles.registration}>
//             <form method="get" className={styles.formRegistration}>
//                 <div className={styles.header1Container}>
//                 <a href="/" className={styles.logosContainer}><img className={styles.logoImage} src={logo} alt="" /><img className={styles.galleryString} src={galleryString} alt="" /></a>
//                     <div className={styles.header1}>Вход в аккаунт</div>
//                 </div>
//                 <div className={styles.gridTable}>

//                     <input type="text" placeholder="Адрес электронной почты *" className={`${styles.inputboxes} ${styles.email}`} required />

//                     <input type="password" placeholder="Пароль *" className={`${styles.inputboxes} ${styles.password}`} required />

//                 </div>

//                 <div className={styles.btnSubmitContainer}>
//                     <button type="submit" className={styles.btnSubmit}>Войти</button>
//                     <div className={styles.loginBtnContainer}>Нет аккаунта? <a href="/registration" className={styles.loginBtn}>Зарегистрироваться</a></div>
//                 </div>
//             </form>
//         </div>
//     )
// }

import React, { useState } from 'react';
import styles from "../styles/stylesForRegistration.module.css";
import logo from "../images/logo.png";
import galleryString from "../images/galleryString.png";
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            username: email, // Передаем email в качестве username
            password: password
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            if (response.ok) {
                // Сохраняем токен доступа в localStorage
                localStorage.setItem('token', data.token);
                setError(null);
                navigate(`/`);
                const accessToken = localStorage.getItem('token');
                if (!accessToken) {
                    console.error('Access token is missing');
                    return;
                }

                // Добавляем токен в заголовок запроса
                const headers = {
                    'Authorization': 'Bearer ' + accessToken
                };

                const response = await fetch('http://localhost:8080/api/auth/getusername', {
                method: 'GET',
                headers: headers
                });
                const result = await response.text();
                localStorage.setItem('username', result);
                window.dispatchEvent(new Event("usernameChanged")); // уведомим об изменении
                console.log(result);

            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Login failed");
        }
    };

    return (
        <div className={styles.registration}>
            <form onSubmit={handleSubmit} className={styles.formRegistration}>
                <div className={styles.header1Container}>
                    <a href="/" className={styles.logosContainer}>
                        <img className={styles.logoImage} src={logo} alt="" />
                        <img className={styles.galleryString} src={galleryString} alt="" />
                    </a>
                    <div className={styles.header1}>Вход</div>
                </div>
                <div className={styles.gridTable}>
                    <input type="name" placeholder="Имя пользователя *" className={`${styles.inputboxes} ${styles.email}`} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Пароль *" className={`${styles.inputboxes} ${styles.password}`} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <div className={styles.errorMatchPasswords}>{error}</div>}
                </div>
                <div className={styles.btnSubmitContainer}>
                    <button type="submit" className={styles.btnSubmit}>Войти</button>
                    <div className={styles.loginBtnContainer}>Еще не зарегистрированы? <a href="/registration" className={styles.loginBtn}>Зарегистрироваться</a></div>
                </div>
            </form>
        </div>
    )
}
