import styles from './autos.module.css';
import Link from 'next/link';

export default function AutosPage() {
    return (
        <main className={styles.mainWrapper}>
            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.videoBackground}
                >
                    <source src="https://jjdluxegarage.com/wp-content/uploads/2022/02/venta-y-restauracion-de-coches-clasicos-jjdluxe-garage-video.mp4" type="video/mp4" />
                </video>

                <div className={styles.overlay}></div>

                <div className={styles.heroContent}>
                    <h1 className={styles.title}>Coches Clásicos y de Lujo</h1>
                    <p className={styles.subtitle}>Elegancia atemporal. Potencia inigualable.</p>
                    <Link href="/autos/inventario" className={styles.ctaButton}>
                        Ver Inventario
                    </Link>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className={styles.servicesSection}>
                {/* RESTORATION BLOCK */}
                <div className={styles.serviceBlock}>
                    <img
                        src="https://jjdluxegarage.com/wp-content/uploads/2022/02/venta-de-coches-clasicos-jjdluxe-garage-s-h.jpg"
                        alt="Restauración de Coches"
                        className={styles.serviceImage}
                    />
                    <div className={styles.serviceOverlay}></div>
                    <div className={styles.serviceContent}>
                        <h2 className={styles.serviceTitle}>RESTAURACIÓN<br />DE COCHES</h2>
                        <svg className={styles.curvedLine} viewBox="0 0 150 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 18C40 -6 110 -6 148 18" stroke="#c5a059" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <Link href="/servicios/restauracion" className={styles.serviceButton}>
                            CONSULTA PROYECTOS REALIZADOS
                        </Link>
                    </div>
                </div>

                {/* SALES BLOCK */}
                <div className={styles.serviceBlock}>
                    <img
                        src="https://jjdluxegarage.com/wp-content/uploads/2022/02/restauracion-de-coches-clasicos-jjdluxe-garage-s-h.jpg"
                        alt="Venta de Coches"
                        className={styles.serviceImage}
                    />
                    <div className={styles.serviceOverlay}></div>
                    <div className={styles.serviceContent}>
                        <h2 className={styles.serviceTitle}>VENTA<br />DE COCHES</h2>
                        <svg className={styles.curvedLine} viewBox="0 0 150 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 18C40 -6 110 -6 148 18" stroke="#c5a059" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <Link href="/autos/inventario" className={styles.serviceButton}>
                            ENCUENTRA EL COCHE DE TUS SUEÑOS
                        </Link>
                    </div>
                </div>
            </section>

            {/* WORKSHOP CONTACT SECTION */}
            <section className={styles.workshopSection}>
                {/* LEFT: FORM & IMAGE */}
                <div className={styles.workshopLeft}>
                    <img
                        src="https://images.unsplash.com/photo-1504222490345-c075b6008014?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                        alt="Mechanic"
                        className={styles.mechanicImage}
                    />

                    <div className={styles.formContainer}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <span className={styles.formIcon}>👤</span>
                                <input type="text" placeholder="Nombre *" className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <span className={styles.formIcon}>📞</span>
                                <input type="text" placeholder="Teléfono" className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <span className={styles.formIcon}>✉️</span>
                                <input type="email" placeholder="Email *" className={styles.input} />
                            </div>
                        </div>

                        <div className={styles.selectGroup}>
                            <select className={styles.select}>
                                <option>Servicio</option>
                                <option>Restauración</option>
                                <option>Venta</option>
                                <option>Taller</option>
                            </select>
                        </div>

                        <div className={styles.submitRow}>
                            <div className={styles.checkboxGroup}>
                                <input type="checkbox" id="privacy" />
                                <label htmlFor="privacy">Acepto la política de privacidad.</label>
                            </div>
                            <button className={styles.submitButton}>RESERVAR CITA</button>
                        </div>
                        <p className={styles.privacyText}>Puedes consultar nuestra política de privacidad haciendo click aquí</p>
                    </div>
                </div>

                {/* RIGHT: INFO */}
                <div className={styles.workshopRight}>
                    <h3 className={styles.workshopTitleSmall}>Restauración y Venta de Coches Clásicos · JJDluxe Garage</h3>
                    <h2 className={styles.workshopTitleMain}>TALLER MULTIMARCA CON EL MEJOR SERVICIO PARA TU COCHE.</h2>

                    <Link href="#" className={styles.redButton}>
                        Tu vehículo necesita una inspección?
                    </Link>

                    <Link href="#" className={styles.redButton}>
                        Tour Virtual de nuestro Garaje
                    </Link>

                    <div className={styles.supportWidget}>
                        <img
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            alt="Support"
                            className={styles.supportAvatar}
                        />
                        <div className={styles.supportText}>
                            <span className={styles.supportQuestion}>¿Tienes alguna pregunta sobre nuestros servicios?</span>
                            <span className={styles.supportPhone}>📞 654 080 074 · 655 272 390</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* DETAILS GRID SECTION */}
            <section className={styles.detailsSection}>
                <div className={styles.detailsGrid}>
                    {/* 1. INFO CARD */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoText}>
                            En nuestro Taller Mecánico Multimarca nos ocupamos de todas las necesidades de tu vehículo.
                        </h3>
                        <p className={styles.infoDescription}>
                            Deja en nuestras manos el cuidado de tu coche, somos especialistas en Restauración y Venta de Coches Clásicos con más de 15 años de experiencia.
                        </p>
                        <Link href="/servicios" className={styles.infoButton}>
                            CONSULTA NUESTROS SERVICIOS
                        </Link>
                    </div>

                    {/* 2. RESTORATION CARD */}
                    <div className={styles.gridCard}>
                        <img
                            src="https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Proyectos de Restauración"
                            className={styles.cardImage}
                        />
                        <h4 className={styles.cardTitle}>Proyectos de Restauración</h4>
                    </div>

                    {/* 3. SALES CARD */}
                    <div className={styles.gridCard}>
                        <img
                            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Venta de Vehículos"
                            className={styles.cardImage}
                        />
                        <h4 className={styles.cardTitle}>Venta de Vehículos</h4>
                    </div>

                    {/* 4. MECHANICS CARD */}
                    <div className={styles.gridCard}>
                        <img
                            src="https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Mecánica"
                            className={styles.cardImage}
                        />
                        <h4 className={styles.cardTitle}>Mecánica</h4>
                    </div>

                    {/* 5. BODY & PAINT CARD */}
                    <div className={styles.gridCard}>
                        <img
                            src="https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Chapa y Pintura"
                            className={styles.cardImage}
                        />
                        <h4 className={styles.cardTitle}>Chapa y Pintura</h4>
                    </div>

                    {/* 6. UPHOLSTERY CARD */}
                    <div className={styles.gridCard}>
                        <img
                            src="https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Tapicería"
                            className={styles.cardImage}
                        />
                        <h4 className={styles.cardTitle}>Tapicería</h4>
                    </div>
                </div>
            </section>
        </main>
    );
}
