// Posts service to handle blog post interactions
const postsService = {
  // Format date to readable format
  formatDate: (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  },

  // Create post HTML element
  createPostElement: (post) => {
    const isLoggedIn = window.authService && window.authService.isLoggedIn();
    const token = isLoggedIn ? window.authService.getToken() : null;
    const user = isLoggedIn ? window.authService.getUser() : null;
    
    // Check if post is liked by current user
    const isLiked = user && post.likes && post.likes.includes(user._id);
    
    // Check if post is saved by current user
    const isSaved = user && user.savedPosts && user.savedPosts.includes(post._id);
    
    const postElement = document.createElement('article');
    postElement.className = 'post';
    postElement.dataset.id = post._id;
    
    postElement.innerHTML = `
      <img src="${post.image || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80'}" alt="${post.title}">
      <div class="post-content">
        <h2>${post.title}</h2>
        <div class="post-meta">
          <span><i class="far fa-calendar"></i> ${postsService.formatDate(post.createdAt)}</span>
          <span><i class="far fa-user"></i> ${post.author ? post.author.name : 'Unknown'}</span>
        </div>
        <p>${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
        <div class="post-actions">
          <a href="blog.html?id=${post._id}" class="read-more">Read More</a>
          ${isLoggedIn ? `
            <button class="like-btn ${isLiked ? 'liked' : ''}" data-action="like">
              <i class="fas fa-heart"></i> <span class="like-count">${post.likes ? post.likes.length : 0}</span>
            </button>
            <button class="save-btn ${isSaved ? 'saved' : ''}" data-action="save">
              <i class="fas fa-bookmark"></i>
            </button>
          ` : ''}
        </div>
      </div>
    `;
    
    // Add event listeners for like and save buttons
    if (isLoggedIn) {
      const likeBtn = postElement.querySelector('.like-btn');
      const saveBtn = postElement.querySelector('.save-btn');
      
      likeBtn.addEventListener('click', () => postsService.handleLike(post._id, likeBtn));
      saveBtn.addEventListener('click', () => postsService.handleSave(post._id, saveBtn));
    }
    
    return postElement;
  },

  // Handle like button click
  handleLike: async (postId, button) => {
    try {
      const token = window.authService.getToken();
      const response = await window.api.posts.likePost(postId, token);
      
      // Update UI
      const likeCount = button.querySelector('.like-count');
      likeCount.textContent = response.likes.length;
      
      if (response.likes.includes(window.authService.getUser()._id)) {
        button.classList.add('liked');
      } else {
        button.classList.remove('liked');
      }
    } catch (error) {
      alert(error.message);
    }
  },

  // Handle save button click
  handleSave: async (postId, button) => {
    try {
      const token = window.authService.getToken();
      await window.api.posts.savePost(postId, token);
      
      // Update UI
      button.classList.toggle('saved');
    } catch (error) {
      alert(error.message);
    }
  },

  // Load all posts
  loadPosts: async () => {
    // Try to find the container on the homepage or blog page
    const container = document.getElementById('blog-posts-container') || document.getElementById('blog-grid');
    if (!container) return;
    
    try {
      // Try to fetch posts from API
      let posts = [];
      try {
        posts = await window.api.posts.getAllPosts();
      } catch (error) {
        console.log('API error, using sample posts:', error);
        // Use sample posts if API fails
        posts = postsService.getSamplePosts();
      }
      
      // Clear loading message
      container.innerHTML = '';
      
      if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">No posts found.</div>';
        return;
      }
      
      // Add posts to container
      posts.forEach(post => {
        container.appendChild(postsService.createPostElement(post));
      });
    } catch (error) {
      container.innerHTML = `<div class="error">Error loading posts: ${error.message}</div>`;
    }
  },

  // Get sample posts for when API is not available
  getSamplePosts: () => {
    return [
      {
        _id: '1',
        title: 'Getting Started with Web Development',
        content: 'Web development is an exciting field that combines creativity with technical skills. In this post, we\'ll explore the basics of HTML, CSS, and JavaScript, and how they work together to create beautiful and functional websites. Whether you\'re a complete beginner or looking to refresh your knowledge, this guide will help you understand the fundamentals of web development.',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
        author: { name: 'John Doe' },
        createdAt: '2024-03-15T10:30:00Z',
        likes: [],
        comments: []
      },
      {
        _id: '2',
        title: 'The Art of Minimalist Design',
        content: 'Minimalist design focuses on simplicity and functionality. By removing unnecessary elements, minimalist design creates a clean, uncluttered look that puts the focus on the content. In this post, we\'ll explore the principles of minimalist design and how to apply them to your own projects. We\'ll also look at some examples of successful minimalist designs and what makes them effective.',
        image: 'https://images.unsplash.com/photo-1517502166878-35c93a0072f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
        author: { name: 'Jane Smith' },
        createdAt: '2024-03-10T14:45:00Z',
        likes: [],
        comments: []
      },
      {
        _id: '3',
        title: 'Understanding JavaScript Promises',
        content: 'JavaScript Promises are a powerful way to handle asynchronous operations. They provide a cleaner alternative to callbacks and make it easier to manage complex asynchronous code. In this post, we\'ll dive deep into how Promises work, how to create them, and how to use them effectively in your JavaScript applications. We\'ll also cover async/await, which is built on top of Promises and provides an even more elegant way to write asynchronous code.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
        author: { name: 'Alex Johnson' },
        createdAt: '2024-03-05T09:15:00Z',
        likes: [],
        comments: []
      },
      {
        _id: '4',
        title: 'Responsive Design Best Practices',
        content: 'Responsive design is essential for creating websites that work well on all devices, from desktop computers to smartphones. In this post, we\'ll explore the best practices for responsive design, including fluid grids, flexible images, and media queries. We\'ll also discuss how to test your responsive designs and ensure they provide a good user experience across all devices.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
        author: { name: 'Sarah Williams' },
        createdAt: '2024-02-28T16:20:00Z',
        likes: [],
        comments: []
      }
    ];
  },

  // Load single post
  loadPost: async (postId) => {
    const container = document.getElementById('single-post-container');
    if (!container) return;
    
    try {
      // Try to fetch post from API
      let post;
      try {
        post = await window.api.posts.getPost(postId);
      } catch (error) {
        console.log('API error, using sample post:', error);
        // Use sample post if API fails
        post = postsService.getSamplePosts().find(p => p._id === postId);
        if (!post) {
          throw new Error('Post not found');
        }
      }
      
      // Clear loading message
      container.innerHTML = '';
      
      // Create post element
      container.appendChild(postsService.createPostElement(post));
      
      // Add comments section
      const commentsSection = document.createElement('section');
      commentsSection.className = 'comments-section';
      commentsSection.innerHTML = `
        <h3>Comments (${post.comments ? post.comments.length : 0})</h3>
        <div class="comments-list">
          ${post.comments && post.comments.length > 0 ? post.comments.map(comment => `
            <div class="comment">
              <div class="comment-header">
                <span class="comment-author">${comment.user.name}</span>
                <span class="comment-date">${postsService.formatDate(comment.createdAt)}</span>
              </div>
              <div class="comment-content">${comment.text}</div>
            </div>
          `).join('') : '<p>No comments yet.</p>'}
        </div>
        ${window.authService && window.authService.isLoggedIn() ? `
          <form id="comment-form" class="comment-form">
            <div class="form-group">
              <textarea id="comment-text" placeholder="Write a comment..." required></textarea>
            </div>
            <button type="submit" class="submit-btn">Post Comment</button>
          </form>
        ` : '<p class="login-to-comment">Please <a href="login.html">login</a> to leave a comment.</p>'}
      `;
      
      container.appendChild(commentsSection);
      
      // Add event listener for comment form
      const commentForm = document.getElementById('comment-form');
      if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const commentText = document.getElementById('comment-text').value;
          postsService.addComment(postId, commentText);
        });
      }
    } catch (error) {
      container.innerHTML = `<div class="error">Error loading post: ${error.message}</div>`;
    }
  },

  // Add comment to post
  addComment: async (postId, commentText) => {
    try {
      const token = window.authService.getToken();
      const response = await window.api.posts.addComment(postId, commentText, token);
      
      // Reload post to show new comment
      postsService.loadPost(postId);
    } catch (error) {
      alert(error.message);
    }
  },

  // Initialize posts service
  init: () => {
    // Check if we're on a single post page
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (postId) {
      postsService.loadPost(postId);
    } else {
      postsService.loadPosts();
    }
  }
};

// Initialize posts service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  postsService.init();
}); 