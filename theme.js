// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    // Update icon based on theme
    function updateIcon(theme) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}); 