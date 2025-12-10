'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import CardModal from '../../components/CardModal';
import AddressSelector from '../../components/AddressSelector';
import Toast from '../../components/Toast';
import styles from './checkout.module.css';
import paymentStyles from './payment-options.module.css';

import { supabase } from '../../lib/supabase';

export default function CheckoutPage() {
    const { cartItems } = useCart();
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping for now logic
    const total = subtotal + shipping + 3.95; // + Order Protection

    const [paymentMethod, setPaymentMethod] = useState('');
    const [savedCards, setSavedCards] = useState([]);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);
    const [allAddresses, setAllAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [toast, setToast] = useState(null);
    const [user, setUser] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    // Form State
    const [email, setEmail] = useState('');
    const [shippingAddress, setShippingAddress] = useState({
        country: 'United States',
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });

    // Fetch user, address, and saved cards on mount
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setEmail(user.email);

                // Fetch saved cards
                const { data: cardsData } = await supabase
                    .from('payment_cards')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('is_default', { ascending: false });

                if (cardsData && cardsData.length > 0) {
                    setSavedCards(cardsData);
                    setPaymentMethod(`card_${cardsData[0].id}`);
                }

                // Fetch ALL addresses
                const { data: allAddressData } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('is_default', { ascending: false });

                if (allAddressData && allAddressData.length > 0) {
                    setAllAddresses(allAddressData);

                    // Set default address as selected
                    const defaultAddr = allAddressData.find(addr => addr.is_default) || allAddressData[0];
                    setSelectedAddress(defaultAddr);
                    updateShippingAddressFromData(defaultAddr);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    // Helper to update shipping address from address data
    const updateShippingAddressFromData = (addressData) => {
        setShippingAddress({
            country: addressData.country || 'United States',
            firstName: addressData.first_name || '',
            lastName: addressData.last_name || '',
            company: addressData.company || '',
            address: addressData.address || '',
            apartment: addressData.apartment || '',
            city: addressData.city || '',
            state: addressData.state || '',
            zipCode: addressData.zip_code || '',
            phone: addressData.phone || ''
        });
    };

    // Address selection handlers
    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        updateShippingAddressFromData(address);
        setIsAddressSelectorOpen(false);
        showToast('Address updated successfully', 'success');
    };

    const handleEditAddress = (address) => {
        setIsAddressSelectorOpen(false);
        // Redirect to profile page to edit
        window.location.href = '/account/profile';
    };

    const handleAddNewAddress = async (formData) => {
        if (!user) {
            showToast('Please log in to add addresses', 'error');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('addresses')
                .insert([{
                    user_id: user.id,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address: formData.address,
                    apartment: formData.apartment,
                    city: formData.city,
                    state: formData.state,
                    zip_code: formData.zipCode,
                    country: formData.country,
                    phone: formData.phone,
                    is_default: formData.isPrimary || allAddresses.length === 0
                }])
                .select()
                .single();

            if (error) throw error;

            // Update addresses list
            setAllAddresses(prev => [...prev, data]);
            setSelectedAddress(data);
            updateShippingAddressFromData(data);
            showToast('Address added successfully!', 'success');
        } catch (error) {
            console.error('Error adding address:', error);
            showToast('Error adding address', 'error');
        }
    };

    const detectCardType = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (/^4/.test(cleaned)) return 'Visa';
        if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
        if (/^3[47]/.test(cleaned)) return 'Amex';
        return 'Card';
    };

    const handleSaveCard = async (cardData) => {
        if (!user) {
            showToast('Please log in to save cards', 'error');
            return;
        }

        try {
            const cardType = detectCardType(cardData.cardNumber);
            const lastFour = cardData.cardNumber.replace(/\s/g, '').slice(-4);
            const currentYear = new Date().getFullYear();
            const isExpired = parseInt(cardData.expiryYear) < currentYear ||
                (parseInt(cardData.expiryYear) === currentYear && parseInt(cardData.expiryMonth) < (new Date().getMonth() + 1));

            // If remember card is checked, save to database
            if (cardData.rememberCard) {
                const { data, error } = await supabase
                    .from('payment_cards')
                    .insert([{
                        user_id: user.id,
                        card_type: cardType,
                        last_four: lastFour,
                        expiry_month: cardData.expiryMonth.padStart(2, '0'),
                        expiry_year: cardData.expiryYear,
                        cardholder_name: `${cardData.firstName} ${cardData.lastName}`,
                        is_default: savedCards.length === 0,
                        is_expired: isExpired
                    }])
                    .select()
                    .single();

                if (error) throw error;

                setSavedCards(prev => [...prev, data]);
                setPaymentMethod(`card_${data.id}`);
                showToast('Card saved successfully!', 'success');
            }

            setIsCardModalOpen(false);
        } catch (error) {
            console.error('Error saving card:', error);
            showToast('Error saving card', 'error');
        }
    };

    const handleAddNewCard = () => {
        setPaymentMethod('new_card');
        setIsCardModalOpen(true);
    };

    return (
        <div className={styles.container}>
            {/* 1. Header with Centered Logo */}
            <header className={styles.checkoutHeader}>
                <div className={styles.logoSection}>
                    <span className={styles.logoText}>RIPNDIP</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Checkout</span>
                </div>
                <div className={styles.bagIconContainer}>
                    <span>🛍️</span>
                </div>
            </header>

            {/* 2. Banner */}
            <div className={styles.paypalBanner}>
                <div className={styles.paypalLogoContainer}>
                    <img src="/icons/paypal-icon.png" alt="PayPal" style={{ height: '20px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = 'PayPal' }} />
                </div>
                <div className={styles.bannerText}>Buy with PayPal. It's fast and simple.</div>
            </div>

            {/* 3. Main Content Columns */}
            <div className={styles.mainContent}>
                {/* LEFT COLUMN */}
                <div className={styles.leftColumn}>
                    {/* Pay with */}
                    <div className={styles.sectionBlock}>
                        <h2 className={styles.sectionTitle}>Pay with</h2>

                        <div className={paymentStyles.paymentOptions}>
                            {/* Klarna Installments */}
                            <label className={paymentStyles.paymentOption}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'klarna'}
                                    onChange={() => setPaymentMethod('klarna')}
                                    className={paymentStyles.radio}
                                />
                                <div className={paymentStyles.paymentContent}>
                                    <div className={paymentStyles.paymentLogo}>
                                        <span className={paymentStyles.klarnaLogo}>Klarna</span>
                                    </div>
                                    <div className={paymentStyles.paymentDetails}>
                                        <div className={paymentStyles.paymentName}>
                                            Installments <span className={paymentStyles.newBadge}>NEW</span>
                                        </div>
                                        <div className={paymentStyles.paymentDesc}>
                                            4 interest-free payments of ${(total / 4).toFixed(2)} or other options available.
                                            <a href="#" className={paymentStyles.learnMore}>Learn more</a>
                                        </div>
                                    </div>
                                </div>
                            </label>

                            {/* PayPal */}
                            <label className={paymentStyles.paymentOption}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'paypal'}
                                    onChange={() => setPaymentMethod('paypal')}
                                    className={paymentStyles.radio}
                                />
                                <div className={paymentStyles.paymentContent}>
                                    <div className={paymentStyles.paymentLogo}>
                                        <span className={paymentStyles.paypalLogo}>PayPal</span>
                                    </div>
                                    <div className={paymentStyles.paymentName}>PayPal</div>
                                </div>
                            </label>

                            {/* Venmo */}
                            <label className={paymentStyles.paymentOption}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'venmo'}
                                    onChange={() => setPaymentMethod('venmo')}
                                    className={paymentStyles.radio}
                                />
                                <div className={paymentStyles.paymentContent}>
                                    <div className={paymentStyles.paymentLogo}>
                                        <span className={paymentStyles.venmoLogo}>venmo</span>
                                    </div>
                                    <div className={paymentStyles.paymentName}>Venmo</div>
                                </div>
                            </label>

                            {/* Saved Cards */}
                            {savedCards.map((card) => (
                                <label key={card.id} className={paymentStyles.paymentOption}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === `card_${card.id}`}
                                        onChange={() => setPaymentMethod(`card_${card.id}`)}
                                        className={paymentStyles.radio}
                                    />
                                    <div className={paymentStyles.paymentContent}>
                                        <div className={paymentStyles.paymentLogo}>
                                            <span className={paymentStyles.visaLogo}>VISA</span>
                                        </div>
                                        <div className={paymentStyles.paymentName}>
                                            x-{card.last_four}
                                            {card.is_expired && <span className={paymentStyles.expiredText}> Expired</span>}
                                        </div>
                                    </div>
                                </label>
                            ))}

                            {/* Add New Card */}
                            <label className={paymentStyles.paymentOption}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'new_card'}
                                    onChange={handleAddNewCard}
                                    className={paymentStyles.radio}
                                />
                                <div className={paymentStyles.paymentContent}>
                                    <div className={paymentStyles.paymentName}>Add new card</div>
                                    <div className={paymentStyles.cardIcons}>
                                        <span className={paymentStyles.cardIcon}>VISA</span>
                                        <span className={paymentStyles.cardIcon}>MC</span>
                                        <span className={paymentStyles.cardIcon}>DISC</span>
                                        <span className={paymentStyles.cardIcon}>💳</span>
                                    </div>
                                </div>
                            </label>

                        </div>
                    </div>

                    <div className={styles.sectionBlock}>
                        <h2 className={styles.sectionTitle}>Ship to</h2>
                        <div className={styles.shipToCard}>
                            {shippingAddress.firstName ? (
                                <>
                                    <div>{shippingAddress.firstName} {shippingAddress.lastName}</div>
                                    <div>{shippingAddress.address}</div>
                                    {shippingAddress.apartment && <div>{shippingAddress.apartment}</div>}
                                    <div>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</div>
                                    <div>{shippingAddress.country}</div>
                                    <div>{shippingAddress.phone}</div>
                                </>
                            ) : (
                                <div>No address selected</div>
                            )}
                            <button
                                onClick={() => setIsAddressSelectorOpen(true)}
                                className={styles.changeLink}
                                style={{ cursor: 'pointer' }}
                            >
                                Change
                            </button>
                        </div>
                    </div>

                    {/* Review Order */}
                    <div className={styles.sectionBlock}>
                        <h2 className={styles.sectionTitle}>Review order</h2>

                        {cartItems.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className={styles.orderItem}>
                                <div className={styles.itemImageContainer}> {/* Reusing container or using img directly */}
                                    {/* Using Image component, but style class updated in CSS */}
                                    <Image src={item.image} alt={item.name} width={100} height={100} className={styles.orderItemImg} />
                                </div>
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemTitle}>{item.name}</div>
                                    <div className={styles.itemMeta} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        Condition: <span style={{ fontWeight: 'bold', color: '#000' }}>New</span>
                                        <span title="Product Condition" style={{ border: '1px solid #000', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer' }}>i</span>
                                    </div>
                                    <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>

                                    <select className={styles.qtyDropdown} defaultValue={item.quantity}>
                                        <option value="1">Qty 1</option>
                                        <option value="2">Qty 2</option>
                                        <option value="3">Qty 3</option>
                                    </select>

                                    <div className={styles.deliveryInfo}>
                                        <div>Delivery</div>
                                        <div className={styles.greenText}>Free Standard Shipping</div>
                                        <div style={{ color: '#666', fontSize: '12px' }}>Est. delivery: Dec 12 - Dec 18</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className={styles.rightColumn}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryTitle}>Order Summary</div>

                        <div className={styles.summaryRow}>
                            <span>Item ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Tax</span>
                            <span>$0.00</span>
                        </div>

                        <div className={styles.summaryTotal}>
                            <span>Order total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <div className={styles.agreementText}>
                            By clicking Confirm and pay, you agree to the <a href="#">User Agreement</a> and acknowledge our <a href="#">Privacy Notice</a>.
                        </div>

                        <button className={styles.confirmBtn}>Confirm and pay</button>

                        <div className={styles.guarantee}>
                            <span>💲</span> <span><strong>Money Back Guarantee</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Modal */}
            <CardModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onSave={handleSaveCard}
            />

            {/* Address Selector Modal */}
            <AddressSelector
                isOpen={isAddressSelectorOpen}
                addresses={allAddresses}
                selectedAddressId={selectedAddress?.id}
                onClose={() => setIsAddressSelectorOpen(false)}
                onSelect={handleSelectAddress}
                onEdit={handleEditAddress}
                onAddNew={handleAddNewAddress}
            />

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
