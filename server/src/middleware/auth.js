import { getFirebaseAdmin } from '../config/firebaseAdmin.js';
import User from '../models/User.js';

export default async function auth(req, res, next) {
  try {
    if (req.path === '/health') return next();

    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing Bearer token' });
    }

    const admin = getFirebaseAdmin();
    if (!admin || (admin.apps && admin.apps.length === 0)) {
      return res.status(500).json({ error: 'Auth not configured on server' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
      picture: decoded.picture || null
    };

    // Upsert user record: do not overwrite existing name
    await User.findByIdAndUpdate(
      req.user.uid,
      {
        $set: { email: req.user.email, photoURL: req.user.picture },
        $setOnInsert: { _id: req.user.uid, name: req.user.name }
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
