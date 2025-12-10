'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from './profile.module.css';
import AccountHeader from '../../../components/AccountHeader';
import AddressModal from '../../../components/AddressModal';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/admin/login');
        } else {
            setUser(user);
            fetchAddresses(user.id);
            setLoading(false);
        }
    }

    async function fetchAddresses(userId) {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            // Sort: Default first
            const sorted = data.sort((a, b) => (a.is_default === b.is_default ? 0 : a.is_default ? -1 : 1));
            setAddresses(sorted);
        }
    }

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setShowModal(true);
    };

    const handleSaveAddress = async (formData) => {
        try {
            // If setting as default, first unset all other defaults for this user
            if (formData.isDefault) {
                await supabase
                    .from('addresses')
                    .update({ is_default: false })
                    .eq('user_id', user.id);
            }

            // Map form data to database columns
            const newAddress = {
                user_id: user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                company: formData.company,
                address: formData.address,
                apartment: formData.apartment,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zipCode,
                phone: formData.phone,
                country: formData.country,
                is_default: formData.isDefault
            };

            let error;
            if (formData.id) {
                // Update existing
                const { error: updateError } = await supabase
                    .from('addresses')
                    .update(newAddress)
                    .eq('id', formData.id);
                error = updateError;
            } else {
                // Insert new
                const { error: insertError } = await supabase
                    .from('addresses')
                    .insert([newAddress]);
                error = insertError;
            }

            if (error) throw error;

            // Refresh list
            fetchAddresses(user.id);
            setShowModal(false);
            setEditingAddress(null);
        } catch (error) {
            console.error('Error saving address:', error.message);
            alert('Error saving address');
        }
    };

    const deleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchAddresses(user.id);
        } catch (error) {
            console.error('Error deleting address:', error.message);
        }
    }

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    // Use Flex column layout for sticky footer effect
    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AccountHeader user={user} />

            <div className={styles.container}>
                <h1 className={styles.title}>Profile</h1>

                <div className={styles.section}>
                    <div className={styles.field}>
                        <div className={styles.label}>
                            Name <span className={styles.editIcon}>✎</span>
                        </div>
                        {/* Placeholder as Supabase Auth doesn't store name by default, usually in metadata */}
                        <div className={styles.value}>{user.user_metadata?.full_name || '-'}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.label}>Email</div>
                        <div className={styles.value}>{user.email}</div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.addressesHeader}>
                        <span className={styles.sectionTitle}>Addresses</span>
                        <button className={styles.addBtn} onClick={() => { setEditingAddress(null); setShowModal(true); }}>+ Add</button>
                    </div>

                    {addresses.length === 0 ? (
                        <div className={styles.emptyAddress}>
                            <span>ⓘ</span> No addresses added
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                            {addresses.map(addr => (
                                <div
                                    key={addr.id}
                                    className={styles.addressCard}
                                    onClick={() => handleEditAddress(addr)}
                                >
                                    {addr.is_default && (
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Default address</div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ fontWeight: '500' }}>{addr.first_name} {addr.last_name}</div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <span className={styles.editIcon}>✎</span>
                                            <button onClick={(e) => { e.stopPropagation(); deleteAddress(addr.id); }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                                        </div>
                                    </div>
                                    <div>{addr.company}</div>
                                    <div>{addr.address}</div>
                                    <div>{addr.apartment}</div>
                                    <div>{addr.city}, {addr.state} {addr.zip_code}</div>
                                    <div>{addr.country}</div>
                                    <div>{addr.phone}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <AddressModal
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveAddress}
                    initialData={editingAddress}
                />
            )}

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
