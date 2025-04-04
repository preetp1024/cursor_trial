// API base URL
const API_URL = 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Auth API calls
const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Get user profile
  getProfile: async (token) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Posts API calls
const postsAPI = {
  // Get all posts
  getAllPosts: async () => {
    const response = await fetch(`${API_URL}/posts`);
    return handleResponse(response);
  },

  // Get single post
  getPost: async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}`);
    return handleResponse(response);
  },

  // Create new post
  createPost: async (postData, token) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    return handleResponse(response);
  },

  // Like/Unlike post
  likePost: async (postId, token) => {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Add comment to post
  addComment: async (postId, comment, token) => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text: comment }),
    });
    return handleResponse(response);
  },

  // Save/Unsave post
  savePost: async (postId, token) => {
    const response = await fetch(`${API_URL}/posts/${postId}/save`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Export API functions
window.api = {
  auth: authAPI,
  posts: postsAPI,
}; 