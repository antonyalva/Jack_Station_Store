'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import styles from './account.module.css';

import AccountHeader from '../../components/AccountHeader'; // Import new header

export default function AccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/admin/login');
        } else {
            setUser(user);
            setLoading(false);
        }
    }

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AccountHeader user={user} />

            <div className={styles.container}>
                <h1 className={styles.title}>Orders</h1>

                <div className={styles.card}>
                    <p className={styles.emptyTitle}>No orders yet</p>
                    <p className={styles.emptyText}>Go to store to place an order.</p>
                </div>
            </div>

            <footer style={{ padding: '20px 40px', fontSize: '12px', color: '#999', borderTop: '1px solid #eee', marginTop: 'auto', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <a href="#">Refund policy</a>
                    <a href="#">Shipping</a>
                    <a href="#">Privacy policy</a>
                    <a href="#">Terms of service</a>
                </div>
            </footer>
        </div>
    );
}
