import styles from './servicios.module.css';

export default function ServiciosPage() {
    return (
        <main className={styles.mainWrapper}>
            <section className={styles.guaranteesSection}>
                <h1 className={styles.title}>Resultados garantizados 100%</h1>
                <p className={styles.subtitle}>Ofrecemos servicio completo de reparación y mantenimiento de automóviles</p>

                {/* FEATURES ROW */}
                <div className={styles.featuresRow}>
                    <div className={styles.featureItem}>
                        <svg className={styles.featureIcon} viewBox="0 0 24 24">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                        </svg>
                        <div className={styles.featureContent}>
                            <h3 className={styles.featureTitle}>Todas las marcas</h3>
                            <p className={styles.featureDescription}>
                                Ofrecemos una variedad de servicios de reparación y mantenimiento para todas las marcas y modelos de automóviles, incluso para los de gama alta y clásicos.
                            </p>
                        </div>
                    </div>

                    <div className={styles.featureItem}>
                        <svg className={styles.featureIcon} viewBox="0 0 24 24">
                            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                        </svg>
                        <div className={styles.featureContent}>
                            <h3 className={styles.featureTitle}>Todos los servicios</h3>
                            <p className={styles.featureDescription}>
                                El principio fundamental de nuestro trabajo es ofrecer una amplia gama de servicios de reparación de automóviles de calidad y lo hemos estado haciendo desde el primer día.
                            </p>
                        </div>
                    </div>

                    <div className={styles.featureItem}>
                        <svg className={styles.featureIcon} viewBox="0 0 24 24">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                        <div className={styles.featureContent}>
                            <h3 className={styles.featureTitle}>Experiencia y calidad</h3>
                            <p className={styles.featureDescription}>
                                Contamos con amplia experiencia en servicios de reparación de automóviles de todo tipo. Garantizamos la máxima calidad en todos nuestros trabajos, contamos con el mejor equipo.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CARDS ROW */}
                <div className={styles.cardsRow}>
                    <div className={styles.redCard}>
                        <svg className={styles.cardIcon} viewBox="0 0 24 24">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                        </svg>
                        <h3 className={styles.cardTitle}>MEJORAMOS TU VEHÍCULO</h3>
                        <p className={styles.cardDescription}>Lo cuidaremos con mucho mimo, prometido.</p>
                    </div>

                    <div className={styles.redCard}>
                        <svg className={styles.cardIcon} viewBox="0 0 24 24">
                            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                        </svg>
                        <h3 className={styles.cardTitle}>DIAGNÓSTICO DETALLADO</h3>
                        <p className={styles.cardDescription}>Contamos con las mejores herramientas.</p>
                    </div>

                    <div className={styles.redCard}>
                        <svg className={styles.cardIcon} viewBox="0 0 24 24">
                            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-2.24.58-4 2.12-4 4.31 0 3.05 2.52 4.51 5.31 5.04 2.63.5 3.1 1.48 3.1 2.31 0 1.3-.98 2.35-3.05 2.35-2.07 0-3-1.07-3.09-2.28H6.1c.13 2.59 1.76 4.09 4.1 4.5V23h3v-2.09c2.56-.57 4.7-2.17 4.7-4.79 0-3.25-2.65-4.63-6.1-5.22z" />
                        </svg>
                        <h3 className={styles.cardTitle}>CON EL MEJOR PRECIO</h3>
                        <p className={styles.cardDescription}>Servicios con la mejor relación calidad - precio.</p>
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className={styles.teamSection}>
                <h2 className={styles.teamTitle}>Miembros del equipo</h2>
                <p className={styles.teamSubtitle}>
                    Conoce a nuestro equipo especialista en venta y restauración de coches clásicos. Dinos que necesitas, nos gustan los retos.
                </p>

                <div className={styles.teamGrid}>
                    {/* JULIO */}
                    <div className={styles.teamCard}>
                        <img
                            src="/julio_rodriguez.jpg"
                            alt="Julio Rodriguez"
                            className={styles.teamImage}
                        />
                        <h3 className={styles.memberName}>Julio Rodriguez</h3>
                        <span className={styles.memberRole}>Gerente</span>
                    </div>

                    {/* RAUL */}
                    <div className={styles.teamCard}>
                        <img
                            src="/julio_rodriguez.jpg"
                            alt="Raúl Rodriguez"
                            className={styles.teamImage}
                        />
                        <h3 className={styles.memberName}>Raúl Rodriguez</h3>
                        <span className={styles.memberRole}>Responsable Comercial</span>
                    </div>

                    {/* JOSE */}
                    <div className={styles.teamCard}>
                        <img
                            src="/julio_rodriguez.jpg"
                            alt="José Martinez"
                            className={styles.teamImage}
                        />
                        <h3 className={styles.memberName}>José Martinez</h3>
                        <span className={styles.memberRole}>Encargado de Taller</span>
                    </div>

                    {/* PACO */}
                    <div className={styles.teamCard}>
                        <img
                            src="/julio_rodriguez.jpg"
                            alt="Paco Senabre"
                            className={styles.teamImage}
                        />
                        <h3 className={styles.memberName}>Paco Senabre</h3>
                        <span className={styles.memberRole}>Jefe de Taller</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
