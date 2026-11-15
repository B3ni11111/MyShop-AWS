# MyShop Free Deployment Guide

## Current Status:
- ✅ **Frontend (Vercel)**: Already deployed - https://vercel.com/b3ni11111s-projects/myshop-react-benny
- ⏳ **Backend (Render)**: Ready to deploy
- ⏳ **Database (MongoDB Atlas)**: Ready to set up

This guide covers deploying the remaining services: Render (backend) and MongoDB Atlas (database).

## Prerequisites

- GitHub account (repo must be public or you have GitHub access)
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new project called "MyShop"
4. Click "Build a Database" and select **Shared** (free tier)
5. Choose region closest to you
6. Create a database user:
   - Username: `myshop_user`
   - Password: Generate strong password and save it
7. Add IP whitelist: Click "Add My Current IP Address" or use `0.0.0.0/0` for testing (not recommended for production)
8. Copy the connection string:
   - Click "Drivers" → Node.js
   - Copy the connection string and replace:
     - `<username>` with your username
     - `<password>` with your password
     - `myshop` with database name
   - Example: `mongodb+srv://myshop_user:PASSWORD@cluster.mongodb.net/myshop?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repo: `MyShop-AWS`
5. Configure:
   - **Name**: `myshop-server`
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: `Free`
6. Add environment variables:
   - Click "Advanced"
   - Add variables:
     ```
     NODE_ENV=production
     PORT=3000
     MONGODB_URI=mongodb+srv://myshop_user:PASSWORD@cluster.mongodb.net/myshop?retryWrites=true&w=majority
     ALLOWED_ORIGINS=https://myshop-frontend.vercel.app,http://localhost:5173
     ```
7. Click "Create Web Service"
8. Wait for deployment (~5-10 min)
9. Copy your service URL (e.g., `https://myshop-server.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select your GitHub repo: `MyShop-AWS`
5. Configure:
   - **Project Name**: `myshop-frontend`
   - **Root Directory**: `./front`
   - **Framework Preset**: `Vite`
6. Add environment variables:
   - `VITE_API_URL=https://myshop-server.onrender.com`
7. Click "Deploy"
8. Wait for deployment (~3-5 min)
9. Your frontend will be at: `https://myshop-frontend.vercel.app`

## Step 4: Update Backend CORS

If your Vercel URL is different, update Render environment variable:
- Go to Render Dashboard → myshop-server
- Settings → Environment
- Update `ALLOWED_ORIGINS` to include your actual Vercel domain

## Testing

1. Open your frontend: `https://myshop-frontend.vercel.app`
2. Open browser DevTools (F12)
3. Check Console for errors
4. Try these actions:
   - Browse products
   - Add to cart
   - Check network requests in Network tab
   - Verify API calls go to your Render backend

## Troubleshooting

### Database Connection Error
- Verify MongoDB URI has correct username/password
- Check IP whitelist allows your server IP (Render's IP)
- Ensure database exists in MongoDB Atlas

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes your Vercel domain
- Check Render logs: Dashboard → myshop-server → Logs

### Render Deployment Fails
- Check build logs
- Ensure `npm run build` works locally
- Verify Node.js version compatibility

### API calls not working
- Check that Render backend is running (check status in Render Dashboard)
- Verify `VITE_API_URL` in Vercel is correct
- Check browser Network tab to see actual request URL

## Monitoring

- **Frontend**: Vercel Dashboard → myshop-frontend → Analytics
- **Backend**: Render Dashboard → myshop-server → Logs
- **Database**: MongoDB Atlas → Collections

## Free Tier Limits

- **Vercel**: 100GB bandwidth/month, auto-deploy on push
- **Render**: Free tier spins down after 15 min of inactivity (cold start ~30s)
- **MongoDB Atlas**: 512MB storage, 100MB download/month

## Next Steps

To keep the project alive:
1. Make regular commits to trigger deployments
2. Monitor MongoDB storage usage
3. Consider upgrading if usage exceeds free tier limits
