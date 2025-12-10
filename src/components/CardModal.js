'use client';
import { useState, useEffect } from 'react';
import styles from './CardModal.module.css';

export default function CardModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        securityCode: '',
        firstName: '',
        lastName: '',
        rememberCard: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                cardNumber: '',
                expiryMonth: '',
                expiryYear: '',
                securityCode: '',
                firstName: '',
                lastName: '',
                rememberCard: true
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateCard = () => {
        const newErrors = {};

        // Card number validation (basic)
        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
            newErrors.cardNumber = 'Invalid card number';
        }

        // Expiry validation
        if (!formData.expiryMonth || !formData.expiryYear) {
            newErrors.expiry = 'Expiry date required';
        } else {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            const expYear = parseInt(formData.expiryYear);
            const expMonth = parseInt(formData.expiryMonth);

            if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                newErrors.expiry = 'Card is expired';
            }
        }

        // Security code validation
        if (!formData.securityCode || formData.securityCode.length < 3) {
            newErrors.securityCode = 'Invalid security code';
        }

        // Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateCard()) {
            onSave(formData);
        }
    };

    const detectCardType = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (/^4/.test(cleaned)) return 'Visa';
        if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
        if (/^3[47]/.test(cleaned)) return 'Amex';
        return 'Card';
    };

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, '');
        const match = cleaned.match(/.{1,4}/g);
        return match ? match.join(' ') : cleaned;
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\s/g, '');
        if (value.length <= 16 && /^\d*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                cardNumber: value
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Credit or debit card</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.securityNotice}>
                    🔒 Your payment is secure. Your card details will not be shared with sellers.
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Card number</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formatCardNumber(formData.cardNumber)}
                            onChange={handleCardNumberChange}
                            placeholder="Card number"
                            className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
                            maxLength="19"
                        />
                        {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Expiration date</label>
                            <div className={styles.expiryRow}>
                                <input
                                    type="text"
                                    name="expiryMonth"
                                    value={formData.expiryMonth}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 2 && (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12))) {
                                            handleInputChange({ target: { name: 'expiryMonth', value } });
                                        }
                                    }}
                                    placeholder="MM"
                                    className={`${styles.input} ${styles.smallInput} ${errors.expiry ? styles.inputError : ''}`}
                                    maxLength="2"
                                />
                                <span className={styles.separator}>/</span>
                                <input
                                    type="text"
                                    name="expiryYear"
                                    value={formData.expiryYear}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 4) {
                                            handleInputChange({ target: { name: 'expiryYear', value } });
                                        }
                                    }}
                                    placeholder="YYYY"
                                    className={`${styles.input} ${styles.smallInput} ${errors.expiry ? styles.inputError : ''}`}
                                    maxLength="4"
                                />
                            </div>
                            {errors.expiry && <span className={styles.error}>{errors.expiry}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Security code
                                <span className={styles.infoIcon} title="The 3 or 4 digit code on the back of your card">ⓘ</span>
                            </label>
                            <input
                                type="text"
                                name="securityCode"
                                value={formData.securityCode}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                        handleInputChange({ target: { name: 'securityCode', value } });
                                    }
                                }}
                                placeholder="CVV"
                                className={`${styles.input} ${errors.securityCode ? styles.inputError : ''}`}
                                maxLength="4"
                            />
                            {errors.securityCode && <span className={styles.error}>{errors.securityCode}</span>}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>First name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="First name"
                                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                            />
                            {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Last name"
                                className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                            />
                            {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                        </div>
                    </div>

                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="rememberCard"
                            checked={formData.rememberCard}
                            onChange={handleInputChange}
                            className={styles.checkbox}
                        />
                        <span>Remember this card for future orders</span>
                    </label>

                    <div className={styles.billingAddress}>
                        <strong>Billing address</strong>
                        <p className={styles.addressText}>
                            Antony ALVA, 11422 200th St, Jamaica, NY 11412-2809, United States
                        </p>
                        <a href="#" className={styles.editLink}>Edit your billing address</a>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.doneBtn}>
                            Done
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
