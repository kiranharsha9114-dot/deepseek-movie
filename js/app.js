// Simple session management
class AuthService {
    constructor() {
        this.currentUser = null;
    }

    // Simulate login (replace with real API call)
    login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Demo validation - in real app, this would be an API call
                if (email && password.length >= 6) {
                    const user = {
                        email: email,
                        loginTime: new Date().toISOString()
                    };
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUser = user;
                    resolve(user);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
}

const authService = new AuthService();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Dashboard initialization
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }

    // Modal handling
    initializeModals();
}

function initializeModals() {
    const modal = document.getElementById('signupModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function showSignup() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;

        await authService.login(email, password);
        
        // Show success message
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        showMessage(error.message || 'Login failed. Please try again.', 'error');
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    // Simple signup simulation
    showMessage('Signup functionality would be implemented here!', 'success');
    
    // Close modal after 2 seconds
    setTimeout(() => {
        const modal = document.getElementById('signupModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }, 2000);
}

function initializeDashboard() {
    if (!authService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = authService.getCurrentUser();
    
    // Update user info in dashboard
    const userEmailElement = document.getElementById('userEmail');
    const dashboardEmailElement = document.getElementById('dashboardEmail');
    const lastLoginElement = document.getElementById('lastLogin');
    
    if (userEmailElement) userEmailElement.textContent = user.email;
    if (dashboardEmailElement) dashboardEmailElement.textContent = user.email;
    if (lastLoginElement) {
        lastLoginElement.textContent = new Date(user.loginTime).toLocaleString();
    }
}

function logout() {
    authService.logout();
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Export for global access (if needed)
window.authService = authService;
window.logout = logout;
window.showSignup = showSignup;
