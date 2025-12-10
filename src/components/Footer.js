import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.topSection}>
                <div className={styles.links}>
                    <h3>SHOP</h3>
                    <a href="#">New Arrivals</a>
                    <a href="#">Best Sellers</a>
                    <a href="#">Sale</a>
                    <a href="#">Gift Cards</a>
                </div>

                <div className={styles.links}>
                    <h3>HELP</h3>
                    <a href="#">Shipping & Delivery</a>
                    <a href="#">Returns & Exchanges</a>
                    <a href="#">Size Guide</a>
                    <a href="#">Contact Us</a>
                </div>

                <div className={styles.links}>
                    <h3>ABOUT</h3>
                    <a href="#">Our Story</a>
                    <a href="#">Store Locator</a>
                    <a href="#">Careers</a>
                    <a href="#">Privacy Policy</a>
                </div>

                <div className={styles.newsletter}>
                    <h3>JOIN THE GANG</h3>
                    <p>Subscribe for exclusive drops and early access.</p>
                    <div className={styles.inputGroup}>
                        <input type="email" placeholder="Enter your email" />
                        <button>SUBSCRIBE</button>
                    </div>
                </div>
            </div>

            <div className={styles.bottomSection}>
                <p>© 2025 RIPNDIP. All Rights Reserved.</p>
                <div className={styles.socials}>
                    {/* Placeholders for social icons */}
                    <span>IG</span>
                    <span>FB</span>
                    <span>TT</span>
                    <span>YT</span>
                </div>
            </div>
        </footer>
    );
}
