const express = require('express');
const router = express.Router({ mergeParams: true });
const bl = require('../BL/logic');

// 🟢 POSTS PART

// GET all posts for a user
router.get('/', async (req, res) => {
    try {
        const posts = await bl.getAllItems('posts');
        // אפשר לסנן פה לפי user_id אם צריך
        res.json(posts.filter(p => p.user_id == req.params.id));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET post by ID
router.get('/:postId', async (req, res) => {
    try {
        const post = await bl.getItemById('posts', req.params.postId);
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE post for a user
router.post('/', async (req, res) => {
    try {
        const postData = { ...req.body, user_id: req.params.id };
        const newPostId = await bl.createItem('posts', postData);
        res.status(201).json({ id: newPostId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE post
router.put('/:postId', async (req, res) => {
    try {
        await bl.updateItem('posts', req.params.postId, req.body);
        res.json({ message: 'Post updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE post
router.delete('/:postId', async (req, res) => {
    try {
        await bl.deleteItem('posts', req.params.postId);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🟢 COMMENTS PART (Nested inside posts)

// GET all comments for a post
router.get('/:postId/comments', async (req, res) => {
    try {
        const comments = await bl.getAllItems('comments');
        res.json(comments.filter(c => c.post_id == req.params.postId));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET comment by ID
router.get('/:postId/comments/:commentId', async (req, res) => {
    try {
        const comment = await bl.getItemById('comments', req.params.commentId);
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE comment for a post
router.post('/:postId/comments', async (req, res) => {
    try {
        const commentData = { ...req.body, post_id: req.params.postId };
        const newCommentId = await bl.createItem('comments', commentData);
        res.status(201).json({ id: newCommentId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE comment
router.put('/:postId/comments/:commentId', async (req, res) => {
    try {
        await bl.updateItem('comments', req.params.commentId, req.body);
        res.json({ message: 'Comment updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE comment
router.delete('/:postId/comments/:commentId', async (req, res) => {
    try {
        await bl.deleteItem('comments', req.params.commentId);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
