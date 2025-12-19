'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import styles from './coleccionables.module.css';

export default function ColeccionablesPage() {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubcategories();
    }, []);

    async function fetchSubcategories() {
        setLoading(true);
        try {
            // First get the category ID for 'Coleccionables'
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('id')
                .eq('name', 'Coleccionables')
                .single();

            if (catError) throw catError;

            if (catData) {
                // Get subcategories
                const { data: subData, error: subError } = await supabase
                    .from('subcategories')
                    .select('*')
                    .eq('category_id', catData.id)
                    .order('name');

                if (subError) throw subError;

                // We need to map names to URL slugs to match Header links
                // Header uses: antigüedades -> /coleccionables/antigüedades
                // Simple slugify: lowercase, replace spaces with dashes, remove special chars (maybe)
                // But Header has specific slugs: armas-armaduras, anillos-campeonato
                // Let's create a helper or just do simple replacement

                const mappedSubs = (subData || []).map(sub => {
                    const slug = sub.name
                        .toLowerCase()
                        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                        .replace(/\s+/g, '-') // spaces to dashes
                        .replace(/[^\w-]+/g, ''); // remove other chars

                    return { ...sub, slug };
                });

                setSubcategories(mappedSubs);
            }
        } catch (error) {
            console.error('Error fetching collectibles:', error);
        } finally {
            setLoading(false);
        }
    }

    // Helper to get an icon or emoji for each category (optional, using generic for now)
    const getIcon = (name) => {
        const map = {
            'Antigüedades': '🏺',
            'Armas y Armaduras': '⚔️',
            'Autógrafos': '✍️',
            'Anillos de Campeonato': '💍',
            'Cómics': '📚',
            'Fósiles y Minerales': '🦖',
            'Disney': '🏰',
            'Militaria e Historia': '🎖️',
            'Películas y TV': '🎬',
            'Música': '🎵',
            'Pokémon': '🐱',
            'Deportes': '⚽',
            'Juguetes': '🧸'
        };
        return map[name] || '📦';
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Coleccionables</h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Cargando categorías...</div>
            ) : (
                <div className={styles.grid}>
                    {subcategories.map((sub) => (
                        <Link
                            href={`/coleccionables/${sub.slug}`}
                            key={sub.id}
                            className={styles.card}
                        >
                            <div className={styles.cardImagePlaceholder}>
                                {getIcon(sub.name)}
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardTitle}>{sub.name}</div>
                                <div className={styles.cardCount}>Ver Productos →</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
