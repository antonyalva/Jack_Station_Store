'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "./page.module.css";

const SLIDES = [
  '/images/home_hero_workshop.png',
  '/images/home_hero_workshop.png',
  '/images/home_hero_workshop.png'
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const categories = [
    { id: 1, src: '/images/iron_factory2.png', alt: 'Mechanic holding steering wheel' },
    { id: 2, src: '/images/iron_factory.png', alt: 'Iron Factory Restorations' },
    { id: 3, src: '/images/iron_factory4.png', alt: 'Professional workshop' },
    { id: 4, src: '/images/iron_factory3.png', alt: 'Dashboard testing' }, // Repeating for now due to quota
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        {/* Slider Container - moving part */}
        <div
          className={styles.sliderContainer}
          style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
        >
          {SLIDES.map((src, index) => (
            <div
              key={index}
              className={styles.slide}
              style={{ backgroundImage: `url(${src})` }}
            >
              <div className={styles.overlay}></div>
            </div>
          ))}
        </div>

        {/* Static Content Overlay */}
        <div className={styles.staticContent}>
          <div className={styles.accentBar}></div>
          <h1 className={styles.title}>
            Bevilleper on mero :<br />
            AutoMechani's Workshop.
          </h1>
          <p className={styles.subtitle}>
            The division emphasis of a deir ar piragend frawily<br />
            expets and loveentonalt two seilent.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/servicios" className={styles.btnPrimary}>
              JUNI N MORE
            </Link>
            <Link href="/nosotros" className={styles.btnSecondary}>
              IMOHI WOUT
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <button className={`${styles.navButton} ${styles.prevBtn}`} onClick={prevSlide}>
          ❮
        </button>
        <button className={`${styles.navButton} ${styles.nextBtn}`} onClick={nextSlide}>
          ❯
        </button>

        <div className={styles.dots}>
          {SLIDES.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className={styles.categorySection}>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <div key={cat.id} className={styles.categoryCard}>
              <img src={cat.src} alt={cat.alt} className={styles.categoryImg} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
