'use client';
import { useState } from 'react';
import styles from './AddressSelector.module.css';

export default function AddressSelector({ isOpen, addresses, selectedAddressId, onClose, onSelect, onEdit, onAddNew }) {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [formData, setFormData] = useState({
        country: 'United States',
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        isPrimary: false
    });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'Enter a first name.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Enter a last name.';
        if (!formData.address.trim()) newErrors.address = 'Enter a street address.';
        if (!formData.city.trim()) newErrors.city = 'Enter a city.';
        if (!formData.state.trim()) newErrors.state = 'Enter a state.';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Enter a ZIP code.';
        if (!formData.phone.trim()) newErrors.phone = 'Enter a phone number.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddNewSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            await onAddNew(formData);
            setIsAddingNew(false);
            setFormData({
                country: 'United States',
                firstName: '',
                lastName: '',
                address: '',
                apartment: '',
                city: '',
                state: '',
                zipCode: '',
                phone: '',
                isPrimary: false
            });
        }
    };

    const handleCancelAdd = () => {
        setIsAddingNew(false);
        setFormData({
            country: 'United States',
            firstName: '',
            lastName: '',
            address: '',
            apartment: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            isPrimary: false
        });
        setErrors({});
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Ship to</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                {isAddingNew ? (
                    <form onSubmit={handleAddNewSubmit} className={styles.formContent}>
                        <div className={styles.inputGroup}>
                            <label className={styles.formLabel}>Country or region</label>
                            <select name="country" value={formData.country} onChange={handleInputChange} className={styles.select}>
                                <option value="United States">United States</option>
                            </select>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label className={styles.formLabel}>First name</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                    className={`${styles.formInput} ${errors.firstName ? styles.inputError : ''}`} />
                                {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.formLabel}>Last name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                    className={`${styles.formInput} ${errors.lastName ? styles.inputError : ''}`} />
                                {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.formLabel}>Street address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                                className={`${styles.formInput} ${errors.address ? styles.inputError : ''}`} />
                            {errors.address && <span className={styles.error}>{errors.address}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.formLabel}>Street address 2 (optional)</label>
                            <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange}
                                className={styles.formInput} />
                        </div>

                        <div className={styles.row3}>
                            <div className={styles.inputGroup}>
                                <label className={styles.formLabel}>City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                    className={`${styles.formInput} ${errors.city ? styles.inputError : ''}`} />
                                {errors.city && <span className={styles.error}>{errors.city}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.formLabel}>State/Province/Region</label>
                                <select name="state" value={formData.state} onChange={handleInputChange}
                                    className={`${styles.select} ${errors.state ? styles.inputError : ''}`}>
                                    <option value="">Select...</option>
                                    <option value="NY">New York</option>
                                    <option value="CA">California</option>
                                    <option value="TX">Texas</option>
                                    <option value="FL">Florida</option>
                                </select>
                                {errors.state && <span className={styles.error}>{errors.state}</span>}
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.formLabel}>ZIP code</label>
                                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                                    className={`${styles.formInput} ${errors.zipCode ? styles.inputError : ''}`} />
                                {errors.zipCode && <span className={styles.error}>{errors.zipCode}</span>}
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.formLabel}>Phone number (required)</label>
                            <div className={styles.phoneRow}>
                                <div className={styles.countryCodeSelect}>🇺🇸 +1</div>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                    className={`${styles.formInput} ${styles.phoneInput} ${errors.phone ? styles.inputError : ''}`} />
                            </div>
                            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                        </div>

                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" name="isPrimary" checked={formData.isPrimary} onChange={handleInputChange} className={styles.checkbox} />
                            <span>Save as primary address</span>
                        </label>

                        <div className={styles.footer}>
                            <button type="submit" className={styles.addBtnBlue}>Add</button>
                            <button type="button" onClick={handleCancelAdd} className={styles.cancelBtn}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className={styles.content}>
                            {addresses.map((address) => (
                                <div key={address.id} className={`${styles.addressCard} ${selectedAddressId === address.id ? styles.selected : ''}`}>
                                    <div className={styles.badges}>
                                        {selectedAddressId === address.id && <span className={styles.badge}>SELECTED</span>}
                                        {address.is_default && <span className={`${styles.badge} ${styles.primary}`}>PRIMARY ADDRESS</span>}
                                    </div>
                                    <div className={styles.addressInfo}>
                                        <div className={styles.name}>{address.first_name} {address.last_name}</div>
                                        <div className={styles.addressLine}>{address.address}</div>
                                        {address.apartment && <div className={styles.addressLine}>{address.apartment}</div>}
                                        <div className={styles.addressLine}>{address.city}, {address.state} {address.zip_code}</div>
                                        <div className={styles.addressLine}>{address.country}</div>
                                        <div className={styles.phone}>({address.phone})</div>
                                    </div>
                                    <div className={styles.actions}>
                                        {selectedAddressId !== address.id && (
                                            <button className={styles.selectBtn} onClick={() => onSelect(address)}>Select</button>
                                        )}
                                        <button className={styles.editLink} onClick={() => onEdit(address)}>Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.footer}>
                            <button className={styles.addNewBtn} onClick={() => setIsAddingNew(true)}>Add a new address</button>
                            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
