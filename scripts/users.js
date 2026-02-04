// Users Page JavaScript

let currentEditingId = null;
let currentDeleteId = null;
let allUsers = [];
let filteredUsers = [];

// DOM Elements
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const userForm = document.getElementById('userForm');
const usersTableBody = document.getElementById('usersTableBody');
const searchInput = document.getElementById('searchInput');
const genderFilter = document.getElementById('genderFilter');
const roleFilter = document.getElementById('roleFilter');

// Modal Controls
const addUserBtn = document.getElementById('addUserBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Open Add User Modal
addUserBtn.addEventListener('click', () => {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Add New User';
    userForm.reset();
    clearErrors();
    userModal.classList.add('active');
});

// Close Modals
closeModal.addEventListener('click', () => userModal.classList.remove('active'));
cancelBtn.addEventListener('click', () => userModal.classList.remove('active'));
closeDeleteModal.addEventListener('click', () => deleteModal.classList.remove('active'));
cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('active'));

// Close modal when clicking outside
userModal.addEventListener('click', (e) => {
    if (e.target === userModal) {
        userModal.classList.remove('active');
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

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const gender = document.getElementById('userGender').value;
    const role = document.getElementById('userRole').value;

    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 3) {
        showError('nameError', 'Name must be at least 3 characters');
        isValid = false;
    }

    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!Utils.isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email');
        isValid = false;
    } else {
        // Check for duplicate email (excluding current user when editing)
        const users = DataManager.getUsers();
        const duplicate = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.id !== currentEditingId
        );
        if (duplicate) {
            showError('emailError', 'This email is already registered');
            isValid = false;
        }
    }

    if (!gender) {
        showError('genderError', 'Please select a gender');
        isValid = false;
    }

    if (!role) {
        showError('roleError', 'Please select a role');
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

// Form Submit
userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const userData = {
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        gender: document.getElementById('userGender').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value
    };

    if (currentEditingId) {
        DataManager.updateUser(currentEditingId, userData);
        Utils.showNotification('User updated successfully!');
    } else {
        DataManager.addUser(userData);
        Utils.showNotification('User added successfully!');
    }

    userModal.classList.remove('active');
    loadUsers();
});

// Edit User
function editUser(id) {
    currentEditingId = id;
    const user = DataManager.getUserById(id);
    
    if (!user) return;

    document.getElementById('modalTitle').textContent = 'Edit User';
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userGender').value = user.gender;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    
    clearErrors();
    userModal.classList.add('active');
}

// Delete User
function deleteUser(id) {
    currentDeleteId = id;
    const user = DataManager.getUserById(id);
    
    if (!user) return;

    document.getElementById('deleteUserName').textContent = user.name;
    deleteModal.classList.add('active');
}

confirmDeleteBtn.addEventListener('click', () => {
    if (currentDeleteId) {
        DataManager.deleteUser(currentDeleteId);
        Utils.showNotification('User deleted successfully!');
        deleteModal.classList.remove('active');
        loadUsers();
    }
});

// Render Users Table
function renderUsers(users) {
    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No users found
                </td>
            </tr>
        `;
        return;
    }

    usersTableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</td>
            <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
            <td>
                <span class="status-badge ${user.status}">
                    ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
            </td>
            <td>${Utils.formatDate(user.registrationDate)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editUser(${user.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteUser(${user.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load and Filter Users
function loadUsers() {
    allUsers = DataManager.getUsers();
    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const genderValue = genderFilter.value;
    const roleValue = roleFilter.value;

    filteredUsers = allUsers.filter(user => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm);
        
        const matchesGender = !genderValue || user.gender === genderValue;
        const matchesRole = !roleValue || user.role === roleValue;

        return matchesSearch && matchesGender && matchesRole;
    });

    renderUsers(filteredUsers);
}

// Search and Filter Event Listeners
const debouncedFilter = Utils.debounce(applyFilters, 300);
searchInput.addEventListener('input', debouncedFilter);
genderFilter.addEventListener('change', applyFilters);
roleFilter.addEventListener('change', applyFilters);

// Make functions globally available
window.editUser = editUser;
window.deleteUser = deleteUser;

// Initialize
document.addEventListener('DOMContentLoaded', loadUsers);
