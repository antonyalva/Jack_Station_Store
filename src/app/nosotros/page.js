import styles from './nosotros.module.css';

export default function NosotrosPage() {
    return (
        <main className={styles.mainWrapper}>
            <div className={styles.contactContainer}>
                <h1 className={styles.pageTitle}>Contacta con nosotros</h1>

                <div className={styles.gridContainer}>
                    {/* LEFT: LOCATION */}
                    <div className={styles.leftColumn}>
                        <h2 className={styles.columnTitle}>Ubicación</h2>
                        <div className={styles.mapContainer}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3122.569485749767!2d-0.5750882846614457!3d38.62312697961358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6229c1b339308d%3A0x6291350694183856!2sCarrer%20Granada%2C%201%2C%2003440%20Ibi%2C%20Alacant!5e0!3m2!1ses!2ses!4v1644315277123!5m2!1ses!2ses"
                                className={styles.mapFrame}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* CENTER: INFO */}
                    <div className={styles.infoColumn}>
                        <img
                            src="https://jjdluxegarage.com/wp-content/uploads/2021/09/logo-jjdluxegarage.png"
                            alt="JJDluxeGarage"
                            className={styles.logoImage}
                        />
                        <p className={styles.infoText}>
                            Te asesoramos en la restauración de tu coche. Si tienes alguna pregunta sobre nuestro taller o los servicios que ofrecemos, simplemente completa nuestro formulario de contacto a continuación. Alguien del equipo JJDluxeGarage contactará contigo a la mayor brevedad posible.
                        </p>
                        <div className={styles.divider}></div>

                        <ul className={styles.contactList}>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>📍</span> C/ Granada, 1, 03440, Ibi (Alicante).
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>📱</span> 654 080 074 · 655 272 390 (Tel. y WhatsApp).
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>✉️</span> info@jjdluxegarage.com
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>🕒</span> Horario: 7:00 a 15:00 h.
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.icon}>🌐</span> jjdluxegarage
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
