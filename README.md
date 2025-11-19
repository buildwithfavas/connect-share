# LinkedIn Boost

Simple app where users sign in with Google (Firebase), submit LinkedIn post URLs, see a shared feed, and mark items as done once they like/comment on LinkedIn.

## Stack
- Frontend: React (Vite) + TailwindCSS
- Backend: Node.js + Express
- Auth: Firebase (client) + Firebase Admin (server)
- Database: MongoDB (Mongoose)

## Setup

### 1) Firebase
- Create a Firebase project
- Enable Google Sign-In in Authentication
- Create a Service Account and obtain credentials (project id, client email, private key)

### 2) Server
- Copy `server/.env.example` to `server/.env` and fill values
- Install deps and run dev:
```bash
npm install
npm run dev
```
(run the above in the `server` folder)

### 3) Client
- Copy `client/.env.example` to `client/.env` and fill values (VITE_FIREBASE_*)
- Install deps and run dev:
```bash
npm install
npm run dev
```
(run the above in the `client` folder)

### Notes
- The client expects `VITE_API_URL` to point to the server (default `http://localhost:4000/api`).
- The server allows CORS from `http://localhost:5173` by default (configure via `ALLOWED_ORIGIN`).

## Deploy to Vercel (Monorepo: client + server)

This repo has two projects:

- `client` (Vite React) → Static site on Vercel
- `server` (Express) → Vercel Serverless Functions in `server/api`

### 1) Prepare repository

- Push this repository to GitHub/GitLab/Bitbucket.

### 2) Deploy Server (API) on Vercel

- In Vercel Dashboard → Add New → Project → Import this repo
- When asked for Root Directory, choose: `server`
- No special build/output settings required
- Set Environment Variables (Production + Preview):
  - `MONGODB_URI` → your MongoDB Atlas connection string
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY` → paste with literal `\n` for newlines
  - `ALLOWED_ORIGINS` → `https://<your-client>.vercel.app`
- Deploy. After deploy, verify: `https://<your-server>.vercel.app/api/health` → `{ ok: true }`

### 3) Deploy Client on Vercel

- Add New → Project → Import the same repo again
- Root Directory: `client`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables (Production + Preview):
  - `VITE_API_URL` → `https://<your-server>.vercel.app/api`
- Deploy, then open `https://<your-client>.vercel.app`

### 4) Notes

- CORS: make sure `ALLOWED_ORIGINS` on the server contains your client URL exactly (including `https`).
- Firebase Admin: do not use a JSON file path on Vercel; use the three environment variables above. For the private key, replace actual newlines with `\n` before pasting.
- Local dev remains unchanged:
  - Server: `cd server && npm run dev`
  - Client: `cd client && npm run dev`
