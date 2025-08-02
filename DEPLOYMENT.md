# 🚀 Deployment Guide

## Frontend (Vercel) ✅
- Already deployed and working
- URL: https://your-app.vercel.app

## Backend (Render) - Next Steps

### 1. Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository: `stellier7/padelstats`
5. Configure the service:
   - **Name**: `padel-stats-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2. Add PostgreSQL Database
1. In Render dashboard, click "New" → "PostgreSQL"
2. Name it: `padel-stats-db`
3. Plan: Free
4. Copy the **Internal Database URL** (we'll need this)

### 3. Set Environment Variables
In your Render Web Service → Environment tab, add:

```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="production"
CORS_ORIGIN="https://your-vercel-app.vercel.app"
```

### 4. Deploy and Get URL
1. Click "Create Web Service"
2. Render will auto-deploy
3. Copy the generated URL: `https://your-app.onrender.com`

### 5. Update Frontend API URL
Once you have the Render URL, update this file:
`frontend/src/services/api.ts` line 94:

```typescript
const apiUrl = isProduction 
  ? 'https://your-app.onrender.com/api'  // Replace with your actual Render URL
  : (process.env.REACT_APP_API_URL || 'http://localhost:3001/api');
```

### 6. Test the Connection
1. Go to your Vercel frontend
2. Try to sign in with:
   - Email: `admin@padelstats.com`
   - Password: `PadelAdmin2024!`

## Database Setup
After deployment, you'll need to run database migrations manually:
1. Go to your Render Web Service
2. Click "Shell" tab
3. Run: `npm run db:generate && npm run db:migrate && npm run db:seed`

## Troubleshooting
- Check Render logs for any deployment errors
- Verify environment variables are set correctly
- Test the backend URL directly: `https://your-app.onrender.com/health` 