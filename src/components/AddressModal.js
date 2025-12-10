'use client';
import React, { useState } from 'react';
import styles from './AddressModal.module.css';

export default function AddressModal({ onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        country: initialData?.country || 'United States',
        firstName: initialData?.first_name || '',
        lastName: initialData?.last_name || '',
        company: initialData?.company || '',
        address: initialData?.address || '',
        apartment: initialData?.apartment || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        zipCode: initialData?.zip_code || '',
        phone: initialData?.phone || '',
        isDefault: initialData?.is_default || false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Add address</h2>
                    <button onClick={onClose} className={styles.closeBtn}>×</button>
                </div>

                <form onSubmit={handleSubmit} className={styles.body}>
                    <div className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            id="defaultAddress"
                        />
                        <label htmlFor="defaultAddress">This is my default address</label>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="Mexico">Mexico</option>
                        </select>
                    </div>

                    <div className={styles.row}>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                className={styles.input}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                className={styles.input}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="company"
                            placeholder="Company"
                            className={styles.input}
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            className={styles.input}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="apartment"
                            placeholder="Apartment, suite, etc (optional)"
                            className={styles.input}
                            value={formData.apartment}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                className={styles.input}
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={styles.select}
                            >
                                <option value="" disabled>State</option>
                                <option value="Alabama">Alabama</option>
                                <option value="New York">New York</option>
                                <option value="California">California</option>
                                {/* Add more states as needed */}
                            </select>
                        </div>
                        <div className={`${styles.formGroup} ${styles.col}`}>
                            <input
                                type="text"
                                name="zipCode"
                                placeholder="ZIP code"
                                className={styles.input}
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex' }}>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                className={styles.input}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </form>

                <div className={styles.footer}>
                    <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                    <button type="button" onClick={handleSubmit} className={styles.saveBtn}>Save</button>
                </div>
            </div>
        </div>
    );
}
