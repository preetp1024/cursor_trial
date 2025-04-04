// Auth service to handle user authentication and session management
const authService = {
  // Check if user is logged in
  isLoggedIn: () => {
    return localStorage.getItem('token') !== null;
  },

  // Get current user token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get current user data
  getUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Set user data and token
  setUser: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  },

  // Clear user data and token (logout)
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/index.html';
  },

  // Handle login form submission
  handleLogin: async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await window.api.auth.login({ email, password });
      authService.setUser(response, response.token);
      window.location.href = '/index.html';
    } catch (error) {
      alert(error.message);
    }
  },

  // Handle register form submission
  handleRegister: async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const response = await window.api.auth.register({ name, email, password });
      authService.setUser(response, response.token);
      window.location.href = '/index.html';
    } catch (error) {
      alert(error.message);
    }
  },

  // Update UI based on authentication status
  updateAuthUI: () => {
    const authLinks = document.querySelector('.auth-links');
    if (!authLinks) return;
    
    if (authService.isLoggedIn()) {
      const user = authService.getUser();
      authLinks.innerHTML = `
        <span class="user-name">Hello, ${user.name}</span>
        <a href="#" class="login-link" id="logout-btn">Logout</a>
      `;
      
      document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        authService.logout();
      });
    } else {
      authLinks.innerHTML = `
        <a href="login.html" class="login-link">Login</a>
        <a href="register.html" class="register-link">Register</a>
      `;
    }
  }
};

// Initialize auth service
document.addEventListener('DOMContentLoaded', () => {
  // Update UI based on auth status
  authService.updateAuthUI();
  
  // Add event listeners to login form if it exists
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', authService.handleLogin);
  }
  
  // Add event listeners to register form if it exists
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', authService.handleRegister);
  }
}); 