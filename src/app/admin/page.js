'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { getUserRole } from '../../lib/auth-helpers';
import Toast from '../../components/Toast';
import styles from './admin.module.css';

export default function AdminPage() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [catalogExpanded, setCatalogExpanded] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };


    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        cost: '',
        unit: 'Unidad (UND)',
        description: '',
        category: 'Apparel',
        condition: 'new'
    });
    const [imageFiles, setImageFiles] = useState([]);

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const lowerString = searchTerm.toLowerCase();
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(lowerString) ||
                p.category.toLowerCase().includes(lowerString)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products]);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/admin/login');
            return;
        }

        const role = await getUserRole(user.id);
        if (role !== 'admin') {
            alert('Access denied: Admins only.');
            router.push('/'); // Redirect customers to home
        } else {
            setUser(user);
            fetchProducts();
        }
        setRoleLoading(false);
    }

    // Wrap content to prevent flash of content
    if (roleLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Checking access...</div>;

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push('/admin/login');
    }

    async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (error) console.error('Error fetching products:', error);
        else {
            setProducts(data || []);
            setFilteredProducts(data || []);
        }
        setLoading(false);
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            cost: product.cost || '',
            unit: product.unit || 'Unidad (UND)',
            description: product.description || '',
            category: product.category,
            condition: product.condition || 'new'
        });
        setImageFiles([]); // Reset files
        setIsModalOpen(true);
    };

    const openNewModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', cost: '', unit: 'Unidad (UND)', description: '', category: 'Apparel', condition: 'new' });
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const uploadedUrls = [];

            if (imageFiles.length > 0) {
                // Upload all images
                const uploadPromises = imageFiles.map(async (file) => {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
                    return data.publicUrl;
                });

                const results = await Promise.all(uploadPromises);
                uploadedUrls.push(...results);
            }

            // Determine images to save
            let finalImages = uploadedUrls;
            let finalMainImage = uploadedUrls.length > 0 ? uploadedUrls[0] : '';

            // If editing and no new images, keep existing
            if (editingProduct && uploadedUrls.length === 0) {
                finalImages = editingProduct.images || [];
                finalMainImage = editingProduct.image_url;
            } else if (editingProduct && uploadedUrls.length > 0) {
                finalImages = [...(editingProduct.images || []), ...uploadedUrls];
                finalMainImage = editingProduct.image_url || ((uploadedUrls.length > 0) ? uploadedUrls[0] : '');
            }

            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                cost: parseFloat(formData.cost || 0),
                unit: formData.unit,
                description: formData.description,
                category: formData.category,
                condition: formData.condition,
                image_url: finalMainImage,
                images: finalImages
            };

            let error;
            if (editingProduct) {
                // UPDATE
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);
                error = updateError;
            } else {
                // INSERT
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([productData]);
                error = insertError;
            }

            if (error) throw error;

            showToast(editingProduct ? 'Producto actualizado exitosamente!' : 'Producto creado exitosamente!', 'success');
            setIsModalOpen(false);
            fetchProducts();

        } catch (error) {
            console.error('Error saving product:', error);
            showToast(`Error al guardar: ${error.message}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error('Error deleting:', error);
        else fetchProducts();
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
                    <div className={styles.navItem}>
                        <span>📊</span> Dashboard
                    </div>
                </div>


                <div className={styles.nav}>
                    <div className={styles.navSection}>CATÁLOGO</div>
                    <div
                        className={styles.navItem}
                        onClick={() => setCatalogExpanded(!catalogExpanded)}
                        style={{ justifyContent: 'space-between' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: '#9333ea' }}>📦</span>
                            <span style={{ color: '#9333ea' }}>Inventario</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#9333ea' }}>
                            {catalogExpanded ? '▼' : '▶'}
                        </span>
                    </div>

                    {catalogExpanded && (
                        <div className={styles.submenu}>
                            <div className={`${styles.submenuItem} ${styles.active}`}>
                                Catálogo de Productos
                            </div>
                            <div className={styles.submenuItem} onClick={() => router.push('/admin/categorias')}>
                                Categorías
                            </div>
                            <div className={styles.submenuItem}>
                                Inventario
                            </div>
                            <div className={styles.submenuItem}>
                                Proveedores
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.nav}>
                    <div className={styles.navSection}>Sistema</div>
                    <div className={styles.navItem}>
                        <span>⚙️</span> Configuración
                    </div>
                </div>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <span>🚪</span> Cerrar Sesión
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h1>Catálogo de Productos</h1>
                        <div className={styles.headerSubtitle}>Gestiona tu inventario y existencias</div>
                    </div>
                    <button className={styles.newProductBtn} onClick={openNewModal}>
                        <span>+</span> Nuevo Producto
                    </button>
                </div>

                {/* STATS */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statTitle}>Total Productos</div>
                        <div className={styles.statValue}>
                            <span>📦</span> {products.length}
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statTitle}>Categorías Activas</div>
                        <div className={styles.statValue}>
                            <span>🏷️</span> {[...new Set(products.map(p => p.category))].length}
                        </div>
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeaderControl}>
                        <div className={styles.title} style={{ fontWeight: '600' }}>Listado</div>
                        <div className={styles.searchContainer}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar..."
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
                                    <th>Condición</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th style={{ textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>Loading...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No products found.</td></tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id} className={styles.tableRow}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '40px', height: '40px', position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                                                        {product.image_url ? (
                                                            <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                                                        ) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>}
                                                    </div>
                                                    <div className={styles.productNameCell}>
                                                        <span className={styles.productName}>{product.name}</span>
                                                        <span className={styles.productSku}>ID: {product.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${product.condition === 'used' ? styles.used : styles.new}`}>
                                                    {product.condition || 'new'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${styles.apparel}`}>{product.category}</span>
                                            </td>
                                            <td style={{ fontWeight: '600' }}>S/. {product.price}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button className={styles.actionBtn} onClick={() => openEditModal(product)} style={{ marginRight: '8px' }}>✏️</button>
                                                <button className={styles.actionBtn} onClick={() => handleDelete(product.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>×</button>
                        <h2 className={styles.modalTitle}>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>

                        <form onSubmit={handleSubmit} className={styles.formGrid}>

                            {/* Row 1: Name & Category */}
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Nombre *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="Ej. T-Shirt Nermal"
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Categoría *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                    >
                                        <option>Apparel</option>
                                        <option>Accessories</option>
                                        <option>Skate</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Price, Cost, Unit */}
                            <div className={styles.formRow3}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Precio Venta *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Costo (Ref)</label>
                                    <input
                                        type="number"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="0"
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Unidad</label>
                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                    >
                                        <option>Unidad (UND)</option>
                                        <option>Kilogramo (KG)</option>
                                        <option>Litro (LTR)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Condition */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Condición</label>
                                <div className={styles.radioGroup}>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="new"
                                            checked={formData.condition === 'new'}
                                            onChange={handleInputChange}
                                            className={styles.radioInput}
                                        />
                                        Nuevo
                                    </label>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="used"
                                            checked={formData.condition === 'used'}
                                            onChange={handleInputChange}
                                            className={styles.radioInput}
                                        />
                                        Usado
                                    </label>
                                </div>
                            </div>

                            {/* Row 4: Description */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={styles.textarea}
                                    placeholder="Describe el producto..."
                                />
                            </div>

                            {/* Row 5: Images */}
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Imágenes</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleImageChange}
                                    className={styles.input}
                                    accept="image/*"
                                    style={{ padding: '8px' }}
                                />
                                <div className={styles.fileInputWrapper}>
                                    {imageFiles.length > 0 ? `${imageFiles.length} archivos seleccionados` : 'Seleccionar archivos'}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className={styles.createBtn} disabled={uploading}>
                                    {uploading ? (editingProduct ? 'Actualizando...' : 'Creando...') : (editingProduct ? 'Actualizar Producto' : 'Crear Producto')}
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
