import express from 'express';
import UserPostStatus from '../models/UserPostStatus.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { isValidLinkedInUrl } from '../utils/validators.js';

const router = express.Router();

router.get('/', async (req, res) => {
  return res.json({
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
    linkedinUrl: (await User.findById(req.user.uid).select('linkedinUrl').lean())?.linkedinUrl || null
  });
});

router.get('/done', async (req, res) => {
  try {
    const statuses = await UserPostStatus.find({ userId: req.user.uid, status: 'done' })
      .select('postId updatedAt')
      .lean();
    const ids = statuses.map((s) => s.postId);
    const posts = await Post.find({ _id: { $in: ids } }).lean();
    const byId = Object.fromEntries(posts.map((p) => [String(p._id), p]));
    const list = statuses
      .map((s) => {
        const p = byId[String(s.postId)];
        if (!p) return null;
        return { ...p, doneAt: s.updatedAt };
      })
      .filter(Boolean);
    return res.json(list);
  } catch (err) {
    console.error('Fetch done error:', err);
    return res.status(500).json({ error: 'Failed to fetch done posts' });
  }
});

// POST /api/me/profile { name, linkedinUrl }
router.post('/profile', async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, linkedinUrl } = req.body || {};
    const cleanName = (name || '').toString().trim();
    const cleanUrl = (linkedinUrl || '').toString().trim();
    if (!cleanName) return res.status(400).json({ error: 'Name is required' });
    if (!cleanUrl) return res.status(400).json({ error: 'LinkedIn URL is required' });
    if (!isValidLinkedInUrl(cleanUrl)) return res.status(400).json({ error: 'Invalid LinkedIn URL' });

    await User.findByIdAndUpdate(
      uid,
      { $set: { name: cleanName, linkedinUrl: cleanUrl } },
      { upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('profile save error', e);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

export default router;
