import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/linkedin-boost';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {});
  console.log('MongoDB connected');
}
