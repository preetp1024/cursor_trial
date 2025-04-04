const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const post = await Post.create({
            title,
            content,
            image,
            author: req.user._id,
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name')
            .populate('comments.user', 'name');
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const isLiked = post.likes.includes(req.user._id);
        if (isLiked) {
            // Unlike
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { likedPosts: post._id }
            });
        } else {
            // Like
            post.likes.push(req.user._id);
            await User.findByIdAndUpdate(req.user._id, {
                $push: { likedPosts: post._id }
            });
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user._id,
            text: req.body.text
        };

        post.comments.push(comment);
        await post.save();
        
        const updatedPost = await Post.findById(req.params.id)
            .populate('comments.user', 'name');
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Save/Unsave post
// @route   PUT /api/posts/:id/save
// @access  Private
const savePost = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const postId = req.params.id;

        const isSaved = user.savedPosts.includes(postId);
        if (isSaved) {
            // Unsave
            user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
        } else {
            // Save
            user.savedPosts.push(postId);
        }

        await user.save();
        res.json(user.savedPosts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPost,
    likePost,
    addComment,
    savePost,
}; 