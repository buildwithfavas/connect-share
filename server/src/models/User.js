import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String }, // Firebase UID
  email: { type: String },
  name: { type: String },
  linkedinUrl: { type: String },
  photoURL: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
