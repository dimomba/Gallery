// import styles from "../styles/stylesForRegistration.module.css"
// import React, { useState } from 'react';
// import logo from "../images/logo.png"
// import galleryString from "../images/galleryString.png"


// export function Registration() {
//     const [password1, setPassword1] = useState('');
//     const [password2, setPassword2] = useState('');
//     const passwordsMatch = password1 === password2;

//     return (
//         <div className={styles.registration}>
//             <form method="get" className={styles.formRegistration}>
//                 <div className={styles.header1Container}>
//                 <a href="/" className={styles.logosContainer}><img className={styles.logoImage} src={logo} alt="" /><img className={styles.galleryString} src={galleryString} alt="" /></a>
//                     <div className={styles.header1}>Создать аккаунт</div>
//                 </div>
//                 <div className={styles.gridTable}>

//                     <input type="text" placeholder="Имя *" className={`${styles.inputboxes} ${styles.name}`} required />

//                     <input type="text" placeholder="Адрес электронной почты *" className={`${styles.inputboxes} ${styles.email}`} required />

//                     <input type="password" id="password1" value={password1} onChange={(e) => setPassword1(e.target.value)} placeholder="Пароль *" className={`${styles.inputboxes} ${styles.password}`} required />

//                     <input type="password" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Повторите пароль *" className={`${styles.inputboxes} ${styles.repeatPassword}`} required />
//                     {!passwordsMatch && <div className={styles.errorMatchPasswords}>Пароли не совпадают</div>}

//                 </div>

//                 <div className={styles.btnSubmitContainer}>
//                     <button type="submit" id="registerButton" className={styles.btnSubmit} disabled={!passwordsMatch}>Зарегистрироваться</button>
//                     <div className={styles.loginBtnContainer}>Уже есть аккаунт? <a href="/login" className={styles.loginBtn}>Войти</a></div>
//                 </div>
//             </form>
//         </div>
//     )
// }

import React, { useState } from 'react';
import styles from "../styles/stylesForRegistration.module.css"
import logo from "../images/logo.png"
import galleryString from "../images/galleryString.png"
import { useNavigate } from 'react-router-dom';


export function Registration() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const passwordsMatch = password1 === password2;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password1 !== password2) {
            setError("Пароли не совпадают");
            return;
        }

        const user = {
            username: username,
            email: email,
            password: password1
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            if (response.ok) {
                navigate(`/login`);
                setError(null);
            } else {
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Registration failed");
        }
    };

    return (
        <div className={styles.registration}>
            <form onSubmit={handleSubmit} className={styles.formRegistration}>
                <div className={styles.header1Container}>
                    <a href="/" className={styles.logosContainer}><img className={styles.logoImage} src={logo} alt="" /><img className={styles.galleryString} src={galleryString} alt="" /></a>
                    <div className={styles.header1}>Зарегистрироваться</div>
                </div>
                <div className={styles.gridTable}>
                    <input type="text" placeholder="Имя пользователя *" className={`${styles.inputboxes} ${styles.name}`} value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type="email" placeholder="Адрес электронной почты *" className={`${styles.inputboxes} ${styles.email}`} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Пароль *" className={`${styles.inputboxes} ${styles.password}`} value={password1} onChange={(e) => setPassword1(e.target.value)} required />
                    <input type="password" placeholder="Повторите пароль *" className={`${styles.inputboxes} ${styles.repeatPassword}`} value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                    {error && <div className={styles.errorMatchPasswords}>{error}</div>}
                </div>
                <div className={styles.btnSubmitContainer}>
                    <button type="submit" id="registerButton" className={styles.btnSubmit} disabled={!passwordsMatch}>Зарегистрироваться</button>
                    <div className={styles.loginBtnContainer}>Уже есть аккаунт? <a href="/login" className={styles.loginBtn}>Войти</a></div>
                </div>
            </form>
        </div>
    )
}
