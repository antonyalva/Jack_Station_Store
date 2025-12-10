'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './AccountHeader.module.css';

export default function AccountHeader({ user }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftNav}>
                <Link href="/" className={styles.logo}>
                    RIPNDIP
                </Link>
                <nav className={styles.navLinks}>
                    <Link href="/" className={styles.navLink}>Shop</Link>
                    <Link href="/account" className={`${styles.navLink} ${styles.activeLink}`}>Orders</Link>
                </nav>
            </div>

            <div className={styles.userSection} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className={styles.userIcon}>
                    👤 <span>▾</span>
                </div>

                {dropdownOpen && (
                    <div className={styles.dropdown}>
                        <div className={styles.dropdownHeader}>
                            {user?.email}
                        </div>
                        <Link href="/account/profile" className={styles.dropdownItem}>
                            Profile
                        </Link>
                        <button className={styles.dropdownItem}>Settings</button>
                        <button onClick={handleSignOut} className={styles.dropdownItem} style={{ color: 'red' }}>
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
