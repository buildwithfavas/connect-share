import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    aId: { type: String, required: true }, // lexical smaller uid
    bId: { type: String, required: true }, // lexical larger uid
    requesterId: { type: String, required: true }, // who initiated the request
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
  },
  { timestamps: true }
);

connectionSchema.index({ aId: 1, bId: 1 }, { unique: true });

export default mongoose.model('Connection', connectionSchema);
