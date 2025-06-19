import styles from "../styles/stylesForFooter.module.css"
import iconphone from "../images/iconphone.png"
import iconemail from "../images/iconemail.png"

export function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.container}>
                <div className={`${styles.unit} ${styles.about}`}>
                    <div className={`${styles.headeraboutus} ${styles.h2}`}>О нас</div>
                    <div>Галерея — социальный интернет-сервис, фото- и видеохостинг, позволяющий пользователям опубликовывать изображения и видео, просматривать и оценивать чужие публикации.</div>
                </div>

                <div className={`${styles.unit} ${styles.services}`}>
                    <div className={`${styles.headerinfoinfooter} ${styles.h2}`}><a href="/upload">Создать свою публикацию</a></div>
                    <div>Для создания публикации Вам необходимо быть зарегистрированным, войти в аккаунт, затем загрузить файл фото или видео, указать название, описание и теги к публикации.</div>
                </div>

                <div className={`${styles.unit} ${styles.adressinfooter}`}>
                    <div className={`${styles.headercontactsinfooter} ${styles.h2}`}>Контакты</div>
                    <div className={styles.phonenumber}><img src={iconphone} alt=""/><a href="tel:+7(3452)29-11-00">+7 (3452) 29-11-00</a></div>
                    <div className={styles.mail}><img src={iconemail} alt=""/><a href="mailto:info@gallery.ru">info@gallery.ru</a></div>
                </div>
            </div>
        </div>
    )
}