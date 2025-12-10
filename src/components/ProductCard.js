'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    const handleQuickAdd = (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url || product.image || '/images/tee.png',
            size: 'Standard', // Default size for quick add
            quantity: 1
        });
    };

    // Get images for hover effect
    const primaryImage = product.image_url || product.image || '/images/tee.png';
    const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : null;
    const displayImage = (isHovered && secondaryImage) ? secondaryImage : primaryImage;

    return (
        <Link href={`/product/${product.id}`} className={styles.card}>
            <div
                className={styles.imageContainer}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {product.discount && (
                    <div className={styles.badge}>{product.discount}</div>
                )}
                <Image
                    src={displayImage}
                    alt={product.name}
                    width={400}
                    height={400}
                    className={styles.image}
                />
                {/* Quick Add Button */}
                <button
                    className={styles.quickAdd}
                    onClick={handleQuickAdd}
                    title="Añadir al carrito"
                >
                    +
                </button>
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.priceContainer}>
                    {product.originalPrice && (
                        <span className={styles.originalPrice}>${product.originalPrice}</span>
                    )}
                    <span className={styles.price}>${product.price}</span>
                </div>
            </div>
        </Link>
    );
}
