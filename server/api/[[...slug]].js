import app from '../src/app.js';
import { initFirebase } from '../src/config/firebaseAdmin.js';
import { connectMongo } from '../src/config/mongo.js';

let initPromise;

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      initFirebase();
      await connectMongo();
    })();
  }
  return initPromise;
}

export default async function handler(req, res) {
  await ensureInitialized();
  return app(req, res);
}
