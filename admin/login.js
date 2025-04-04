document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'dashboard.html';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // For demo purposes, using hardcoded credentials
        // In a real application, this would be handled server-side
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
}); 