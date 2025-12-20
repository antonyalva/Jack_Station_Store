'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
    const { isCartOpen, closeCart, cartItems, updateQuantity } = useCart();

    if (!isCartOpen) return null;

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <>
            <div className={styles.overlay} onClick={closeCart} />
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h2>CART</h2>
                    <button onClick={closeCart} className={styles.closeBtn}>✕</button>
                </div>

                <div className={styles.items}>
                    {cartItems.length === 0 ? (
                        <p className={styles.empty}>Your cart is empty.</p>
                    ) : (
                        cartItems.map((item, idx) => (
                            <div key={`${item.id}-${item.size}-${idx}`} className={styles.item}>
                                <div className={styles.imageContainer}>
                                    <Image src={item.image} alt={item.name} width={80} height={80} className={styles.image} />
                                </div>
                                <div className={styles.details}>
                                    <h3>{item.name}</h3>
                                    <p className={styles.meta}>Product Size: {item.size}</p>
                                    <div className={styles.controls}>
                                        <div className={styles.quantity}>
                                            <button onClick={() => updateQuantity(item.id, item.size, -1)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.size, 1)}>+</button>
                                        </div>
                                        <span className={styles.price}>S/ {item.price * item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.row}>
                        <span>SUBTOTAL</span>
                        <span className={styles.subtotalPrice}>S/ {subtotal}</span>
                    </div>

                    <div className={styles.protection}>
                        <div className={styles.protectionText}>
                            <strong>Order Protection</strong> ⓘ
                            <p>Protection for Damage, Loss, Theft & More!</p>
                        </div>
                        <div className={styles.protectionPrice}>
                            S/ 3.95
                            <div className={styles.toggle}>
                                <div className={styles.toggleKnob} />
                            </div>
                        </div>
                    </div>

                    <p className={styles.shippingMsg}>Shipping, taxes, and discount codes calculated at checkout.</p>

                    <Link href="/checkout" onClick={closeCart} style={{ display: 'block' }}>
                        <button className={styles.checkoutBtn}>CHECKOUT NOW</button>
                    </Link>
                </div>
            </div>
        </>
    );
}
