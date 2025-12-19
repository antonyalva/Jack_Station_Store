'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import FilterBar from '../../components/FilterBar';
import ProductGrid from '../../components/ProductGrid';
import styles from "../page.module.css";

export default function AccesoriosPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .in('category', ['Accesorios', 'Accessories', 'accesorios']); // Check for EN/ES and lowercase just in case

            if (error) console.error(error);
            else setProducts(data || []);
            setLoading(false);
        }
        fetchProducts();
    }, []);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>ACCESORIOS</h1>

                <FilterBar />
                {loading ? (
                    <div style={{ minHeight: '400px', display: 'grid', placeItems: 'center' }}>Cargando accesorios...</div>
                ) : (
                    <ProductGrid products={products} />
                )}
            </main>
        </div>
    );
}
