import dotenv from 'dotenv';
import { initFirebase } from './config/firebaseAdmin.js';
import { connectMongo } from './config/mongo.js';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT || 4000;
// Initialize Firebase Admin & start server after DB connection
initFirebase();

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
