// Dashboard Page JavaScript

// Update Statistics
function updateStatistics() {
    const stats = DataManager.getStatistics();
    
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('newUsers').textContent = stats.newUsersToday;
    document.getElementById('newProducts').textContent = stats.newProductsToday;
    document.getElementById('maleCount').textContent = stats.maleUsers;
    document.getElementById('femaleCount').textContent = stats.femaleUsers;
}

// Render Gender Chart
function renderGenderChart() {
    const stats = DataManager.getStatistics();
    const ctx = document.getElementById('genderChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [stats.maleUsers, stats.femaleUsers],
                backgroundColor: ['#16476A', '#FDB5CE'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Render Recent Users
function renderRecentUsers() {
    const recentUsers = DataManager.getRecentUsers(5);
    const container = document.getElementById('recentUsers');
    
    if (recentUsers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No users yet</p>';
        return;
    }
    
    container.innerHTML = recentUsers.map(user => `
        <div class="recent-item">
            <div class="recent-info">
                <h4>${user.name}</h4>
                <p>${user.email}</p>
            </div>
            <div class="recent-date">
                ${Utils.formatDate(user.registrationDate)}
            </div>
        </div>
    `).join('');
}

// Render Recent Products
function renderRecentProducts() {
    const recentProducts = DataManager.getRecentProducts(5);
    const container = document.getElementById('recentProducts');
    
    if (recentProducts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No products yet</p>';
        return;
    }
    
    container.innerHTML = recentProducts.map(product => `
        <div class="recent-item">
            <div class="recent-info">
                <h4>${product.name}</h4>
                <p>${product.category} - ${Utils.formatCurrency(product.price)}</p>
            </div>
            <div class="recent-date">
                ${Utils.formatDate(product.dateAdded)}
            </div>
        </div>
    `).join('');
}

// Initialize Dashboard
function initDashboard() {
    updateStatistics();
    renderGenderChart();
    renderRecentUsers();
    renderRecentProducts();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initDashboard);
