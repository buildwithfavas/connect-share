import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  url: { type: String, unique: true, required: true },
  addedByUserId: { type: String, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
