document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Navigation
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    });

    // New Post Form
    const newPostForm = document.getElementById('new-post-form');
    if (newPostForm) {
        newPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('post-title').value;
            const category = document.getElementById('post-category').value;
            const content = document.getElementById('post-content').value;
            const image = document.getElementById('post-image').files[0];

            // Here you would typically send this data to a server
            // For demo purposes, we'll just show a success message
            alert('Post created successfully!');
            newPostForm.reset();
        });
    }

    // New Category Form
    const newCategoryForm = document.getElementById('new-category-form');
    if (newCategoryForm) {
        newCategoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const categoryName = document.getElementById('category-name').value;
            
            // Here you would typically send this data to a server
            // For demo purposes, we'll just show a success message
            alert('Category added successfully!');
            newCategoryForm.reset();
        });
    }

    // Settings Form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const siteTitle = document.getElementById('site-title').value;
            const siteDescription = document.getElementById('site-description').value;
            const adminEmail = document.getElementById('admin-email').value;
            
            // Here you would typically send this data to a server
            // For demo purposes, we'll just show a success message
            alert('Settings saved successfully!');
        });
    }

    // Load Posts (Demo Data)
    const postsList = document.querySelector('.posts-list');
    if (postsList) {
        const demoPosts = [
            { id: 1, title: 'Getting Started with Web Development', category: 'Technology' },
            { id: 2, title: 'The Art of Photography', category: 'Lifestyle' },
            { id: 3, title: 'Best Travel Destinations 2024', category: 'Travel' }
        ];

        demoPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <div class="post-actions">
                    <button class="edit-btn" onclick="editPost(${post.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deletePost(${post.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            postsList.appendChild(postElement);
        });
    }

    // Load Categories (Demo Data)
    const categoriesList = document.querySelector('.categories-list');
    if (categoriesList) {
        const demoCategories = [
            'Technology',
            'Lifestyle',
            'Travel',
            'Food'
        ];

        demoCategories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-item';
            categoryElement.innerHTML = `
                <span>${category}</span>
                <div class="category-actions">
                    <button class="edit-btn" onclick="editCategory('${category}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteCategory('${category}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            categoriesList.appendChild(categoryElement);
        });
    }
});

// Post Management Functions
function editPost(id) {
    // Here you would typically load the post data and show an edit form
    alert(`Edit post ${id}`);
}

function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        // Here you would typically send a delete request to the server
        alert(`Post ${id} deleted successfully!`);
    }
}

// Category Management Functions
function editCategory(category) {
    // Here you would typically load the category data and show an edit form
    alert(`Edit category: ${category}`);
}

function deleteCategory(category) {
    if (confirm('Are you sure you want to delete this category?')) {
        // Here you would typically send a delete request to the server
        alert(`Category ${category} deleted successfully!`);
    }
} 