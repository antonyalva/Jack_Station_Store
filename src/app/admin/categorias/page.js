'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { getUserRole } from '../../../lib/auth-helpers';
import Toast from '../../../components/Toast';
import styles from '../admin.module.css';

export default function CategoriasPage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [toast, setToast] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(new Set()); // New state for expansion

    const toggleExpand = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        order: 0
    });

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = categories.filter(cat =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categories);
        }
    }, [searchTerm, categories]);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/admin/login');
            return;
        }

        const role = await getUserRole(user.id);
        if (role !== 'admin') {
            alert('Access denied: Admins only.');
            router.push('/');
        } else {
            fetchCategories();
        }
    }

    async function fetchCategories() {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*, subcategories(*)')
            .order('id', { ascending: true }); // Changed from 'order' to 'id'

        if (error) {
            console.error('Error fetching categories:', error);
            showToast('Error al cargar categorías: ' + error.message, 'error');
        } else {
            console.log('Categories loaded:', data);
            setCategories(data || []);
            setFilteredCategories(data || []);
        }
        setLoading(false);
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openNewModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', slug: '', order: categories.length + 1 });
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            order: category.order
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                // Update
                const { error } = await supabase
                    .from('categories')
                    .update({
                        name: formData.name,
                        slug: formData.slug,
                        order: parseInt(formData.order)
                    })
                    .eq('id', editingCategory.id);

                if (error) throw error;
                showToast('Categoría actualizada exitosamente', 'success');
            } else {
                // Insert
                const { error } = await supabase
                    .from('categories')
                    .insert([{
                        name: formData.name,
                        slug: formData.slug,
                        order: parseInt(formData.order)
                    }]);

                if (error) throw error;
                showToast('Categoría creada exitosamente', 'success');
            }

            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            showToast('Error al eliminar la categoría', 'error');
        } else {
            fetchCategories();
        }
    };

    return (
        <div className={styles.layout}>
            {/* SIDEBAR */}
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <span className={styles.logoText}>RIPNDIP</span>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className={styles.navItem}
                    style={{ background: 'transparent', border: 'none', width: '100%', justifyContent: 'flex-start', color: '#666', marginBottom: '20px', cursor: 'pointer' }}
                >
                    <span>🏠</span> Ir a la Tienda
                </button>

                <div className={styles.nav}>
                    <div className={styles.navSection}>Principal</div>
                    <div className={styles.navItem} onClick={() => router.push('/admin')}>
                        <span>📊</span> Dashboard
                    </div>
                </div>

                <div className={styles.nav}>
                    <div className={styles.navSection}>CATÁLOGO</div>
                    <div className={styles.submenu}>
                        <div className={styles.submenuItem} onClick={() => router.push('/admin')}>
                            Catálogo de Productos
                        </div>
                        <div className={`${styles.submenuItem} ${styles.active}`}>
                            Categorías
                        </div>
                        <div className={styles.submenuItem}>
                            Inventario
                        </div>
                        <div className={styles.submenuItem}>
                            Proveedores
                        </div>
                    </div>
                </div>

                <div className={styles.nav}>
                    <div className={styles.navSection}>Sistema</div>
                    <div className={styles.navItem}>
                        <span>⚙️</span> Configuración
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h1>Gestión de Categorías</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => router.push('/admin')}
                            style={{
                                padding: '10px 20px',
                                background: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            ← Volver al Panel
                        </button>
                        <button className={styles.newProductBtn} onClick={openNewModal}>
                            <span>+</span> Nueva Categoría
                        </button>
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeaderControl}>
                        <div className={styles.title} style={{ fontWeight: '600' }}>Categorías</div>
                        <div className={styles.searchContainer}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar categorias..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Slug</th>
                                    <th>Subcategorías</th>
                                    <th>Orden</th>
                                    <th style={{ textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Cargando...</td></tr>
                                ) : filteredCategories.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No se encontraron categorías.</td></tr>
                                ) : (
                                    filteredCategories.map(category => (
                                        <React.Fragment key={category.id}>
                                            <tr
                                                className={styles.tableRow}
                                                onClick={() => toggleExpand(category.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td style={{ fontWeight: '600' }}>
                                                    <span style={{ marginRight: '10px', display: 'inline-block', width: '20px', transition: 'transform 0.2s', transform: expandedCategories.has(category.id) ? 'rotate(90deg)' : 'rotate(0deg)', fontSize: '12px', color: '#666' }}>
                                                        ▶
                                                    </span>
                                                    {category.name}
                                                </td>
                                                <td style={{ color: '#666' }}>{category.slug}</td>
                                                <td>
                                                    {category.subcategories && category.subcategories.length > 0 ? (
                                                        <span style={{
                                                            background: '#f3e8ff',
                                                            color: '#9333ea',
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px',
                                                            fontWeight: '500'
                                                        }}>
                                                            {category.subcategories.length} subcategorías
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                                                    )}
                                                </td>
                                                <td>{category.id}</td>
                                                <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                                                    <button className={styles.actionBtn} onClick={() => openEditModal(category)} style={{ marginRight: '8px' }}>✏️</button>
                                                    <button className={styles.actionBtn} onClick={() => handleDelete(category.id)}>🗑️</button>
                                                </td>
                                            </tr>
                                            {expandedCategories.has(category.id) && category.subcategories && category.subcategories.length > 0 && (
                                                <tr style={{ background: '#f9fafb' }}>
                                                    <td colSpan="5" style={{ padding: '0 0 15px 0', borderBottom: '1px solid #eee' }}>
                                                        <div style={{ marginLeft: '40px', padding: '15px', background: 'white', borderRadius: '0 0 8px 8px', borderLeft: '3px solid #9333ea', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)' }}>
                                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                Subcategorías
                                                            </div>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                {category.subcategories.map(sub => (
                                                                    <span key={sub.id} style={{
                                                                        padding: '6px 12px',
                                                                        background: '#f3f4f6',
                                                                        borderRadius: '20px',
                                                                        fontSize: '13px',
                                                                        color: '#374151',
                                                                        border: '1px solid #e5e7eb',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '5px'
                                                                    }}>
                                                                        {sub.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                            Mostrando {filteredCategories.length} registros
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>Anterior</button>
                            <button style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>Siguiente</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>×</button>
                        <h2 className={styles.modalTitle}>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>

                        <form onSubmit={handleSubmit} className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Nombre *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Ej. Bebidas Calientes"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Ej. bebidas-calientes"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Orden</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="0"
                                />
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className={styles.createBtn}>
                                    {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATIONS */}
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
