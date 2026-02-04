// Products Page JavaScript

let currentEditingId = null;
let currentDeleteId = null;
let allProducts = [];
let filteredProducts = [];

// DOM Elements
const productModal = document.getElementById('productModal');
const deleteModal = document.getElementById('deleteModal');
const productForm = document.getElementById('productForm');
const productsTableBody = document.getElementById('productsTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');

// Modal Controls
const addProductBtn = document.getElementById('addProductBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Open Add Product Modal
addProductBtn.addEventListener('click', () => {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    productForm.reset();
    clearErrors();
    productModal.classList.add('active');
});

// Close Modals
closeModal.addEventListener('click', () => productModal.classList.remove('active'));
cancelBtn.addEventListener('click', () => productModal.classList.remove('active'));
closeDeleteModal.addEventListener('click', () => deleteModal.classList.remove('active'));
cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('active'));

// Close modal when clicking outside
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.remove('active');
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
    }
});

// Form Validation
function validateForm() {
    let isValid = true;
    clearErrors();

    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;

    if (!name) {
        showError('nameError', 'Product name is required');
        isValid = false;
    } else if (name.length < 3) {
        showError('nameError', 'Product name must be at least 3 characters');
        isValid = false;
    }

    if (!category) {
        showError('categoryError', 'Please select a category');
        isValid = false;
    }

    if (!price || price < 0) {
        showError('priceError', 'Please enter a valid price');
        isValid = false;
    }

    if (!stock || stock < 0) {
        showError('stockError', 'Please enter a valid stock quantity');
        isValid = false;
    }

    return isValid;
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// Auto-update status based on stock
document.getElementById('productStock').addEventListener('input', (e) => {
    const stock = parseInt(e.target.value);
    const statusSelect = document.getElementById('productStatus');
    
    if (stock === 0) {
        statusSelect.value = 'out of stock';
    } else if (stock > 0 && statusSelect.value === 'out of stock') {
        statusSelect.value = 'available';
    }
});

// Form Submit
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const productData = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value.trim(),
        status: document.getElementById('productStatus').value
    };

    if (currentEditingId) {
        DataManager.updateProduct(currentEditingId, productData);
        Utils.showNotification('Product updated successfully!');
    } else {
        DataManager.addProduct(productData);
        Utils.showNotification('Product added successfully!');
    }

    productModal.classList.remove('active');
    loadProducts();
});

// Edit Product
function editProduct(id) {
    currentEditingId = id;
    const product = DataManager.getProductById(id);
    
    if (!product) return;

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productStatus').value = product.status;
    
    clearErrors();
    productModal.classList.add('active');
}

// Delete Product
function deleteProduct(id) {
    currentDeleteId = id;
    const product = DataManager.getProductById(id);
    
    if (!product) return;

    document.getElementById('deleteProductName').textContent = product.name;
    deleteModal.classList.add('active');
}

confirmDeleteBtn.addEventListener('click', () => {
    if (currentDeleteId) {
        DataManager.deleteProduct(currentDeleteId);
        Utils.showNotification('Product deleted successfully!');
        deleteModal.classList.remove('active');
        loadProducts();
    }
});

// Render Products Table
function renderProducts(products) {
    if (products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No products found
                </td>
            </tr>
        `;
        return;
    }

    productsTableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
            <td>${Utils.formatCurrency(product.price)}</td>
            <td>${product.stock}</td>
            <td>
                <span class="status-badge ${product.status.replace(' ', '-')}">
                    ${product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
            </td>
            <td>${Utils.formatDate(product.dateAdded)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load and Filter Products
function loadProducts() {
    allProducts = DataManager.getProducts();
    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const statusValue = statusFilter.value;

    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryValue || product.category === categoryValue;
        const matchesStatus = !statusValue || product.status === statusValue;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    renderProducts(filteredProducts);
}

// Search and Filter Event Listeners
const debouncedFilter = Utils.debounce(applyFilters, 300);
searchInput.addEventListener('input', debouncedFilter);
categoryFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);

// Make functions globally available
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts);
