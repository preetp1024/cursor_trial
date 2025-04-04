const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    getPost,
    likePost,
    addComment,
    savePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPost);

router.route('/:id/like')
    .put(protect, likePost);

router.route('/:id/comments')
    .post(protect, addComment);

router.route('/:id/save')
    .put(protect, savePost);

module.exports = router; 