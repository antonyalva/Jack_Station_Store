'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useCart } from '../../../context/CartContext';
import styles from './product.module.css';

export default function ProductPage() {
    const params = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);
    const [images, setImages] = useState([]); // Array of all product images
    const [selectedSize, setSelectedSize] = useState('Large');
    const [quantity, setQuantity] = useState(1);
    const [openAccordions, setOpenAccordions] = useState({
        shipping: false,
        details: true
    });

    const thumbnailsRef = React.useRef(null);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id);
        }
    }, [params.id]);

    async function fetchProduct(id) {
        setLoading(true);
        // If ID is numeric (mock data legacy), we might fail to fetch from UUID table
        // But let's assume we are moving forward with DB data.
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
        } else {
            console.log("Fetched product:", data);
            setProduct(data);

            // Determine images list
            let productImages = [];
            if (data.images && Array.isArray(data.images) && data.images.length > 0) {
                productImages = data.images;
            } else if (data.image_url) {
                productImages = [data.image_url];
            }

            setImages(productImages);
            setMainImage(productImages[0] || '/images/tee.png');
        }
        setLoading(false);
    }

    const toggleAccordion = (section) => {
        setOpenAccordions(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const incrementQty = () => setQuantity(q => q + 1);
    const decrementQty = () => setQuantity(q => q > 1 ? q - 1 : 1);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: mainImage,
            size: selectedSize,
            quantity: quantity
        });
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading product...</div>;
    if (!product) return <div style={{ padding: '100px', textAlign: 'center' }}>Product not found.</div>;



    const scrollThumbnails = (direction) => {
        if (thumbnailsRef.current) {
            const scrollAmount = 100; // Approx height of one thumb + gap
            thumbnailsRef.current.scrollBy({
                top: direction === 'up' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={styles.container}>
            {/* Gallery */}
            <div className={styles.gallery}>
                <div className={styles.thumbnailWrapper}>
                    <button className={styles.scrollBtn} onClick={() => scrollThumbnails('up')}>
                        <span style={{ transform: 'rotate(-90deg)', display: 'block' }}>➜</span>
                    </button>

                    <div className={styles.thumbnails} ref={thumbnailsRef}>
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`${styles.thumbBtn} ${mainImage === img ? styles.active : ''}`}
                                onMouseEnter={() => setMainImage(img)}
                                onClick={() => setMainImage(img)}
                            >
                                <Image
                                    src={img || '/images/tee.png'}
                                    alt="Thumbnail"
                                    width={80}
                                    height={80}
                                    className={styles.thumbImg}
                                />
                            </div>
                        ))}
                    </div>

                    <button className={styles.scrollBtn} onClick={() => scrollThumbnails('down')}>
                        <span style={{ transform: 'rotate(90deg)', display: 'block' }}>➜</span>
                    </button>
                </div>

                <div className={styles.mainImageContainer}>
                    <Image
                        src={mainImage || '/images/tee.png'}
                        alt="Main"
                        width={600}
                        height={600}
                        className={styles.mainImg}
                    />
                </div>
            </div>

            {/* Info Panel */}
            <div className={styles.info}>
                <h1 className={styles.title}>{product.name}</h1>
                <p className={styles.price}>S/ {product.price}</p>

                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>Condition:</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{product.condition ? (product.condition.charAt(0).toUpperCase() + product.condition.slice(1)) : 'New'}</span>
                    <span title="Product Condition info" style={{ border: '1px solid #000', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', cursor: 'pointer' }}>i</span>
                </div>

                <div className={styles.stockWarning}>
                    <span>⚠️</span> Only {product.stock || 3} left
                </div>

                <label className={styles.quantityLabel}>QUANTITY</label>
                <div className={styles.quantitySelector}>
                    <button className={styles.qtyBtn} onClick={decrementQty}>-</button>
                    <div className={styles.qtyValue}>{quantity}</div>
                    <button className={styles.qtyBtn} onClick={incrementQty}>+</button>
                </div>

                <button className={styles.addToCart} onClick={handleAddToCart}>
                    ADD TO CART
                </button>

                <p className={styles.paymentInfo}>
                    4 interest-free installments, or from S/ {product.price / 4}/mo with shopPay
                </p>

                {/* Feature List */}
                <button className={styles.accordionHeader} onClick={() => toggleAccordion('details')}>
                    PRODUCT DETAILS
                    <span>{openAccordions.details ? '-' : '+'}</span>
                </button>
                {openAccordions.details && (
                    <div className={styles.accordionContent}>
                        <ul>
                            <li>{product.description}</li>
                            <li>Category: {product.category}</li>
                            <li>100% Cotton</li>
                            <li>Machine Washable</li>
                        </ul>
                    </div>
                )}

                <div className={styles.accordion}>
                    <button className={styles.accordionHeader} onClick={() => toggleAccordion('shipping')}>
                        SHIPPING INFORMATION
                        <span>{openAccordions.shipping ? '-' : '+'}</span>
                    </button>
                    {openAccordions.shipping && (
                        <div className={styles.accordionContent}>
                            <p>Free In-Store Pickup</p>
                            <p>Standard Shipping: 3-5 Business Days</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
