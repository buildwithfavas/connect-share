import admin from 'firebase-admin';

export function initFirebase() {
  if (admin.apps && admin.apps.length > 0) return;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin env not fully set; auth endpoints will not work until configured.');
    return;
  }

  // Replace escaped newlines in private key
  privateKey = privateKey.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
  });
  console.log('Firebase Admin initialized');
}

export function getFirebaseAdmin() {
  return admin;
}
