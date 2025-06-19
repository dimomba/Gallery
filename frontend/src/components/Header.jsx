import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from "../styles/stylesForHeader.module.css"
import "../styles/stylesForFontAwesome.css"
import logo from "../images/logo.png"
import galleryString from "../images/galleryString.png"

export function Header() {
    const navigate = useNavigate();
    const searchInputRef = useRef(null);
    const [username, setUsername] = useState(localStorage.getItem('username'));

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        const handleUsernameChange = () => {
            const updatedUsername = localStorage.getItem('username');
            setUsername(updatedUsername);
        };

        window.addEventListener("usernameChanged", handleUsernameChange);

        return () => {
            window.removeEventListener("usernameChanged", handleUsernameChange);
        };}, []
    );

    const handleSubmit = async (e) => {
        const searchValue = searchInputRef.current.value;
        navigate(`/search/${searchValue}`);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className={styles.header}>
            <a href="/" className={styles.logosContainer}><img className={styles.logoImage} src={logo} alt="" /><img className={styles.galleryString} src={galleryString} alt="" /></a>
            <div className={styles.searchContainer}>
                <div className={styles.form}>
                    <input type="text" placeholder="Поиск.." id='searchInput' onKeyDown={handleKeyDown} ref={searchInputRef}/>

                    <button onClick={handleSubmit}><i className={styles.searchIcon} class="fa fa-search"></i></button>
                </div>
            </div>
            <a href="/upload" className={styles.uploadLink}><div className={styles.divUpload}><i className={styles.iUpload}>Создать публикацию</i><i className={styles.plusIcon} class="fa fa-plus"></i></div></a>
            {username ? (
                <a href="/my" className={styles.loginLink}><div className={styles.divLogin}><i className={styles.iLogin}>{username}</i><i className={styles.loginIcon} class="fa fa-user"></i></div></a>
            ) : (
                <a href="/login" className={styles.loginLink}><div className={styles.divLogin}><i className={styles.iLogin}>Войти</i><i className={styles.loginIcon} class="fa fa-user"></i></div></a>
            )}
        </div>
    )
}
