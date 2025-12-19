'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import FilterBar from '../../../components/FilterBar';
import ProductGrid from '../../../components/ProductGrid';
import styles from "../../page.module.css"; // Use parent styles for consistent layout

export default function SubcategoryPage() {
    const params = useParams();
    const { subcategory } = params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subcatName, setSubcatName] = useState('');

    useEffect(() => {
        if (subcategory) {
            // Decode URI component just in case
            const decodedSub = decodeURIComponent(subcategory);
            // Format for display (capitalize/humanize if needed, though usually coming as slug or name)
            // For now, simple replacement
            const formattedName = decodedSub.replace(/-/g, ' ').toUpperCase();
            setSubcatName(formattedName);

            fetchProducts(decodedSub);
        }
    }, [subcategory]);

    async function fetchProducts(subParam) {
        setLoading(true);

        // Logic: 
        // 1. Try exact match on 'subcategory' column (ilike for case insensitivity)
        // 2. Filter by main category 'Coleccionables' to be safe, though not strictly required if subcategory is unique

        // Note: The Admin saves 'subcategory' as the NAME (e.g. "Antigüedades"), but URL might be "antiguedades"
        // We might need to handle accent stripping or fuzzy matching. 
        // For now, let's try ILIKE with % wildcards to be flexible: %term%

        let query = supabase
            .from('products')
            .select('*')
            .ilike('category', 'Coleccionables');

        // Logic for handling normalized slugs vs database values
        // Ideally we'd store slugs in DB, but for now we map common ones or search flexibly
        let filterTerm = subParam;

        // Manual mapping for known edge cases
        const slugMap = {
            'antiguedades': 'Antigüedades',
            'autografos': 'Autógrafos',
            'comics': 'Cómics',
            'fosiles-minerales': 'Fósiles', // Partial match
            'peliculas-tv': 'Películas',
            'musica': 'Música',
            'pokemon': 'Pokémon'
        };

        // Fix: Allow both normalized (no accent) and mapped (accented) values
        // This handles cases where DB has "Antiguedades" OR "Antigüedades"
        if (slugMap[subParam.toLowerCase()]) {
            const mappedTerm = slugMap[subParam.toLowerCase()];
            // Search for Mapped Term OR Original Term (fuzzy)
            query = query.or(`subcategory.eq.${mappedTerm},subcategory.ilike.%${subParam}%`);
        } else {
            // Fallback to fuzzy search
            query = query.ilike('subcategory', `%${subParam}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>{subcatName}</h1>

                <FilterBar />

                {loading ? (
                    <div style={{ minHeight: '400px', display: 'grid', placeItems: 'center' }}>
                        Cargando {subcatName.toLowerCase()}...
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <p>No se encontraron productos en esta categoría.</p>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>Busca en Admin si la subcategoría está escrita correctamente.</p>
                    </div>
                ) : (
                    <ProductGrid products={products} />
                )}
            </main>
        </div>
    );
}
