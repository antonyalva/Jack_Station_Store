import styles from './nosotros.module.css';

export default function NosotrosPage() {
    return (
        <main className={styles.mainWrapper}>
            <div className={styles.contactContainer}>
                <h1 className={styles.pageTitle}>Contacta con nosotros</h1>

                <div className={styles.gridContainer}>
                    {/* LEFT: LOCATION */}
                    <div className={styles.leftColumn}>
                        <div className={styles.mapContainer}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.164843914441!2d-77.00411262412853!3d-11.963131740316301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ca38971f6521%3A0x67768fc964a3fa0d!2sAv.+las+Flores+141%2C+San+Juan+de+Lurigancho+15401!5e0!3m2!1ses-419!2spe!4v1700000000000!5m2!1ses-419!2spe"
                                className={styles.mapFrame}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* CENTER: INFO */}
                    <div className={styles.infoColumn}>
                        <div className={styles.logoPlaceholder}>JACK STATION</div>
                        <p className={styles.infoText}>
                            Te asesoramos en la restauración de tu coche. Si tienes alguna pregunta sobre nuestro taller o los servicios que ofrecemos, simplemente completa nuestro formulario de contacto a continuación. Alguien de nuestro equipo contactará contigo a la mayor brevedad posible.
                        </p>
                        <div className={styles.divider}></div>

                        <ul className={styles.contactList}>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>📍</span> Av. las Flores 141, San Juan de Lurigancho LIMA 36, Perú
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>📱</span> +51 977 520 648 (Tel. y WhatsApp).
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>✉️</span> info@jackstation.com
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>🕒</span> Horario: 7:00 a 15:00 h.
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>🌐</span> jackstationstore
                            </li>
                        </ul>
                    </div>

                    {/* RIGHT: FORM */}
                    <div className={styles.formColumn}>
                        <h2 className={styles.columnTitle}>Formulario de contacto</h2>
                        <form>
                            <div className={styles.formGroup}>
                                <input type="text" placeholder="Nombre *" className={styles.inputField} required />
                            </div>
                            <div className={styles.formGroup}>
                                <input type="email" placeholder="Email *" className={styles.inputField} required />
                            </div>
                            <div className={styles.formGroup}>
                                <input type="text" placeholder="Asunto *" className={styles.inputField} required />
                            </div>
                            <div className={styles.formGroup}>
                                <textarea placeholder="Mensaje *" className={styles.textArea} required></textarea>
                            </div>
                            <button type="submit" className={styles.submitButton}>ENVIAR</button>
                            <label className={styles.privacyCheckbox}>
                                <input type="checkbox" required /> Acepto la política de privacidad.
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
