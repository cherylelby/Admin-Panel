// User Dashboard Page JavaScript

let allProducts = [];
let filteredProducts = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const productDetailModal = document.getElementById('productDetailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const closeDetailBtn = document.getElementById('closeDetailBtn');

// Close Product Detail Modal
closeDetailModal.addEventListener('click', () => productDetailModal.classList.remove('active'));
closeDetailBtn.addEventListener('click', () => productDetailModal.classList.remove('active'));

// Close modal when clicking outside
productDetailModal.addEventListener('click', (e) => {
    if (e.target === productDetailModal) {
        productDetailModal.classList.remove('active');
    }
});

// Show Product Detail
function showProductDetail(id) {
    const product = DataManager.getProductById(id);
    
    if (!product) return;

    document.getElementById('detailProductName').textContent = product.name;
    document.getElementById('detailCategory').textContent = 
        product.category.charAt(0).toUpperCase() + product.category.slice(1);
    document.getElementById('detailPrice').textContent = Utils.formatCurrency(product.price);
    document.getElementById('detailStock').textContent = product.stock + ' units';
    
    const statusElement = document.getElementById('detailStatus');
    statusElement.innerHTML = `
        <span class="status-badge ${product.status.replace(' ', '-')}">
            ${product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
    `;
    
    document.getElementById('detailDescription').textContent = 
        product.description || 'No description available';
    document.getElementById('detailDate').textContent = Utils.formatDate(product.dateAdded);
    
    productDetailModal.classList.add('active');
}

// Render Products Grid
function renderProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-box-open" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p style="font-size: 1.2rem;">No products found</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = products.map(product => {
        const isAvailable = product.status === 'available';
        const stockClass = product.stock > 0 ? 'text-success' : 'text-danger';
        
        return `
            <div class="product-card" onclick="showProductDetail(${product.id})">
                <div class="product-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <span class="product-category">${product.category}</span>
                    <div class="product-price">${Utils.formatCurrency(product.price)}</div>
                    <div class="product-stock">
                        <i class="fas fa-warehouse"></i>
                        <span style="color: ${product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)'}">
                            ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </div>
                    ${!isAvailable ? '<div style="margin-top: 0.5rem;"><span class="status-badge out-of-stock">Out of Stock</span></div>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Load and Filter Products
function loadProducts() {
    // Only show available products
    allProducts = DataManager.getProducts();
    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const sortValue = sortFilter.value;

    // Filter products
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryValue || product.category === categoryValue;

        return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortValue) {
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'oldest':
            filteredProducts.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    renderProducts(filteredProducts);
}

// Search and Filter Event Listeners
const debouncedFilter = Utils.debounce(applyFilters, 300);
searchInput.addEventListener('input', debouncedFilter);
categoryFilter.addEventListener('change', applyFilters);
sortFilter.addEventListener('change', applyFilters);

// Make function globally available
window.showProductDetail = showProductDetail;

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts);
