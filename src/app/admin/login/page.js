'use client';
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { getUserRole } from '../../../lib/auth-helpers';
import styles from './login.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); // Import router for redirect after login

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/admin`
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error.message);
            alert('Error logging in with Google');
            setLoading(false);
        }
    };

    const handleEmailLogin = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Check role for redirect
            if (data.user) {
                const role = await getUserRole(data.user.id);
                if (role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/account');
                }
            }

        } catch (error) {
            console.error('Error logging in:', error.message);
            alert(`Error logging in: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    {/* Placeholder for Ripndip Logo */}
                    <h1 style={{ fontFamily: 'fantasy', letterSpacing: '2px', fontSize: '30px' }}>RIPNDIP</h1>
                </div>

                <h1 className={styles.title}>Sign in</h1>
                <p className={styles.subtitle}>Choose how you'd like to sign in</p>

                <button onClick={handleGoogleLogin} className={styles.googleBtn} disabled={loading}>
                    {loading ? 'Please wait...' : 'Sign in with Google'}
                </button>

                <div className={styles.divider}>or</div>

                <div className={styles.inputGroup}>
                    <input
                        type="email"
                        placeholder="Email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleEmailLogin} className={styles.continueBtn} disabled={loading}>
                    {loading ? 'Logging in...' : 'Continue'}
                </button>
            </div>
        </div>
    );
}
