import styles from './FilterBar.module.css';

export default function FilterBar() {
    return (
        <div className={styles.filterBar}>
            <button className={styles.filterBtn}>
                <span className={styles.icon}>⚙️</span> Filter
            </button>

            <div className={styles.sortContainer}>
                <select className={styles.sortSelect} defaultValue="Featured">
                    <option value="Featured">Featured</option>
                    <option value="Best Selling">Best Selling</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Date: New to Old">Date: New to Old</option>
                </select>
            </div>
        </div>
    );
}
