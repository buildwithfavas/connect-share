import express from 'express';
import Post from '../models/Post.js';
import UserPostStatus from '../models/UserPostStatus.js';
import { isValidLinkedInUrl } from '../utils/validators.js';

const router = express.Router();

// Create a post
router.post('/', async (req, res) => {
  const { url } = req.body || {};
  if (!url || !isValidLinkedInUrl(url)) {
    return res.status(400).json({ error: 'Invalid LinkedIn URL' });
  }

  try {
    const existing = await Post.findOne({ url });
    if (existing) return res.status(200).json(existing);

    const post = await Post.create({ url, addedByUserId: req.user.uid });
    return res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ error: 'Failed to create post' });
  }
});

// List feed (exclude done by default)
router.get('/', async (req, res) => {
  const includeDone = req.query.includeDone === 'true';
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    if (!includeDone) {
      const done = await UserPostStatus.find({ userId: req.user.uid }).select('postId').lean();
      const doneSet = new Set(done.map((d) => String(d.postId)));
      const filtered = posts.filter((p) => !doneSet.has(String(p._id)));
      return res.json(filtered);
    }

    return res.json(posts);
  } catch (err) {
    console.error('List posts error:', err);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Mark as done
router.post('/:id/done', async (req, res) => {
  try {
    const { id } = req.params;
    await UserPostStatus.findOneAndUpdate(
      { userId: req.user.uid, postId: id },
      { userId: req.user.uid, postId: id, status: 'done' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('Mark done error:', err);
    return res.status(500).json({ error: 'Failed to mark done' });
  }
});

// Undo done (optional)
router.delete('/:id/done', async (req, res) => {
  try {
    const { id } = req.params;
    await UserPostStatus.deleteOne({ userId: req.user.uid, postId: id });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Undo done error:', err);
    return res.status(500).json({ error: 'Failed to undo done' });
  }
});

// Delete post (only owner)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.addedByUserId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });

    await Post.deleteOne({ _id: id });
    await UserPostStatus.deleteMany({ postId: id });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
