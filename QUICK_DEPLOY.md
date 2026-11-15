# Quick Deploy to Render + Vercel

## ✅ DONE: Vercel Frontend
- Live at: https://vercel.com/b3ni11111s-projects/myshop-react-benny
- Frontend deployment complete

## REMAINING: Backend + Database

## Step 1: Create MongoDB Atlas (FREE - 512MB)
Go to: https://www.mongodb.com/cloud/atlas/register

1. Sign up with Google (your email: benibar777@gmail.com)
2. Create project "MyShop"
3. Create database (Shared - Free tier)
4. Create user: username "myshop" with strong password
5. Allow IP: 0.0.0.0/0
6. Get connection string and copy it

Connection String Format:
```
mongodb+srv://myshop:PASSWORD@cluster.mongodb.net/myshop?retryWrites=true&w=majority
```

## Step 2: Deploy Backend to Render (FREE)
1. Go to: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select: MyShop-AWS repository
4. Configure:
   - Name: myshop-server
   - Build: npm install && npm run build
   - Start: npm run start:prod
   - Plan: FREE
5. Environment Variables:
   ```
   MONGODB_URI=[your connection string from Step 1]
   NODE_ENV=production
   ALLOWED_ORIGINS=https://myshop.vercel.app,http://localhost:5173
   PORT=3000
   ```
6. Deploy → Wait 5-10 min
7. **Copy Render URL** (e.g., https://myshop-server-0mz8.onrender.com)

## Step 3: Deploy Frontend to Vercel (FREE)
1. Go to: https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select: MyShop-AWS
4. Root Directory: ./front
5. Environment Variables:
   ```
   VITE_API_URL=https://myshop-server-0mz8.onrender.com
   ```
6. Deploy → Wait 3-5 min
7. **Copy Vercel URL** (e.g., https://myshop-frontend.vercel.app)

## Step 4: Update Render CORS
1. Render → myshop-server → Settings → Environment
2. Update ALLOWED_ORIGINS:
   ```
   https://myshop-frontend.vercel.app,http://localhost:5173
   ```
3. Save & trigger redeploy

## Done! 🎉
Test at: https://myshop-frontend.vercel.app

All completely FREE tier:
- MongoDB Atlas: 512MB free
- Render: Free tier
- Vercel: Free tier
