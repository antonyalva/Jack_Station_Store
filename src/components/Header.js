import Link from 'next/link';
import { useState, useEffect } from 'react'; // Added imports
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase'; // Added
import { getUserRole } from '../lib/auth-helpers'; // Added
import styles from './Header.module.css';

export default function Header() {
    const { openCart } = useCart();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            const userRole = await getUserRole(user.id);
            setRole(userRole);
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login'; // Hard reload/redirect
    };

    return (
        <header className={styles.header}>
            <div className={styles.topNav}>
                <div className={styles.topLinks}>
                    <a href="#">TRACK YOUR ORDER</a>
                    <a href="#">FIND A STORE</a>

                    {user ? (
                        <div className={styles.userValues} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <span style={{ fontSize: '18px' }}>👤</span>
                            <span>▾</span>

                            {dropdownOpen && (
                                <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                                    <div className={styles.dropdownHeader}>
                                        <div className={styles.avatarCircle}>
                                            {/* Initials Logic: Try metadata name, or fallback to Email first 2 chars */}
                                            {user.user_metadata?.full_name
                                                ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)
                                                : user.email.substring(0, 2)}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userName}>{user.user_metadata?.full_name || 'User'}</div>
                                            <div className={styles.userEmail} title={user.email}>{user.email}</div>
                                        </div>
                                    </div>
                                    <div className={styles.dropdownNav}>
                                        <Link href={role === 'admin' ? "/admin" : "/account/profile"} className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                                            {role === 'admin' ? "Dashboard" : "Profile"}
                                        </Link>
                                        <button className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>Settings</button>
                                        <button onClick={handleSignOut} className={styles.dropdownItem}>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/admin/login">ACCOUNT</Link>
                    )}
                </div>
            </div>

            <div className={styles.mainNav}>
                <div className={styles.logo}>
                    <Link href="/">
                        {/* Using standard img tag to debug loading issue */}
                        <img src="/images/jack_station_logo_v2.jpg" alt="Jack Station" width={150} style={{ objectFit: 'contain', height: 'auto' }} />
                    </Link>
                </div>

                <nav className={styles.navLinks}>
                    <Link href="/" className={styles.active}>INICIO</Link>
                    <Link href="/basics">BASICS</Link>
                    <Link href="/apparel">APPAREL</Link>
                    <Link href="/accessories">ACCESSORIES</Link>
                    <Link href="/collections">COLLECTIONS</Link>
                    <Link href="/gift-card">GIFT CARD</Link>
                </nav>

                <div className={styles.actions}>
                    <button className={styles.iconBtn}>🔍</button>
                    <button className={styles.iconBtn} onClick={openCart}>🛍️</button>
                </div>
            </div>
        </header>
    );
}
