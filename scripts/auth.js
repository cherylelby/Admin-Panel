// Authentication Check
// This script checks if user is logged in before accessing protected pages

function checkAuth(requiredRole) {
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');

    // If not logged in, redirect to login
    if (!userRole || !username) {
        window.location.href = 'login.html';
        return false;
    }

    // If role doesn't match, redirect to appropriate page
    if (requiredRole && userRole !== requiredRole) {
        if (userRole === 'admin') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
        return false;
    }

    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}
