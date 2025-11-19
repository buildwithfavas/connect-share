import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/linkedin-boost';
  mongoose.set('strictQuery', true);

  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const state = mongoose.connection.readyState;
  if (state === 1) {
    return mongoose.connection;
  }
  if (state === 2) {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection));
      mongoose.connection.once('error', reject);
    });
  }

  await mongoose.connect(uri, {});
  console.log('MongoDB connected');
  return mongoose.connection;
}
