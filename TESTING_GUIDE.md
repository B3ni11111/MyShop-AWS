# MyShop Testing Guide - Free Deployment

After deploying to Vercel, Render, and MongoDB Atlas, use this guide to verify everything works.

## Pre-Testing Checklist

✓ MongoDB Atlas cluster created and running  
✓ Backend deployed to Render (check status dashboard)  
✓ Frontend deployed to Vercel (check status dashboard)  
✓ Environment variables set correctly on both platforms  

## Test 1: Backend Health Check

**Goal**: Verify backend is running and accessible

1. Open your Render backend URL in browser: `https://myshop-server-0mz8.onrender.com/`
2. Expected: See "Hello World!" message or 404 (either is fine - means server is running)
3. Check Render logs for any errors

**If fails**: 
- Check Render logs for startup errors
- Verify `MONGODB_URI` is correct
- Ensure Node.js build succeeded

## Test 2: Frontend Loads

**Goal**: Verify frontend loads without errors

1. Open your Vercel frontend: `https://myshop-frontend.vercel.app`
2. Check console for errors (F12 → Console)
3. Look for any red error messages

**Expected behavior**:
- Page loads with product catalog
- Header and footer visible
- Dark/light theme toggle works
- No CORS errors in console

**If fails**:
- Clear browser cache and reload
- Check that `VITE_API_URL` is set to your Render backend
- Look for CORS errors - may need to update `ALLOWED_ORIGINS` on Render

## Test 3: API Connectivity

**Goal**: Verify frontend can communicate with backend

1. Open DevTools (F12)
2. Go to Network tab
3. Reload the page
4. Look for requests to `/api/...`
5. Check response status (should be 200, not 4xx or 5xx)

**Expected**:
- Requests show status 200
- No "CORS error" messages
- Data loads successfully

**If fails**:
- Check backend logs on Render
- Verify `ALLOWED_ORIGINS` includes your Vercel domain
- Make sure backend is still running (check Render status)

## Test 4: Browse Products

**Goal**: Verify products load from API

1. On frontend, navigate to product catalog
2. Products should display with images and prices
3. Check Network tab → API responses

**Expected**:
- Products display correctly
- No console errors
- Images load

**If fails**:
- Check backend logs for database errors
- Verify MongoDB connection is working
- Ensure database has data

## Test 5: Cart Functionality

**Goal**: Verify cart operations work

### 5a: Add to Cart (Without Auth)
1. Find a product
2. Click "Add to Cart"
3. Cart should show item count increase
4. Check localStorage (DevTools → Application → Local Storage)

**Expected**: Item saved to local storage

### 5b: Persist Cart (Local)
1. Add items to cart
2. Refresh page (F5)
3. Cart items should still be there

**Expected**: Cart persists across page reload

## Test 6: Authentication Flow (If Configured)

**Goal**: Verify login works

1. Click login/sign in button
2. Complete auth flow
3. User info should appear in header

**Expected**:
- Authentication dialog appears
- Can sign in with configured provider
- User appears as logged in

**If auth is disabled**: Skip this test

## Test 7: API Error Handling

**Goal**: Verify app handles API errors gracefully

### Scenario: Simulate Backend Down
1. On Render Dashboard, pause the service
2. Go back to frontend
3. Try to perform action that calls API (refresh page)
4. Should show error message, not crash

**Expected**: Friendly error message, not blank page

## Test 8: Cold Start Behavior

**Goal**: Verify Render free tier cold starts work

1. Close browser completely
2. Wait 15+ minutes (free tier spins down after inactivity)
3. Open frontend again
4. First load might be slower (~30 seconds) - this is normal
5. Should still load successfully

**Expected**: Page loads eventually, no permanent errors

## Test 9: Theme Toggle

**Goal**: Verify theme functionality

1. Toggle dark/light theme button (top right)
2. Refresh page
3. Theme should persist

**Expected**: Theme changes and persists on reload

## Test 10: Responsive Design

**Goal**: Verify mobile experience

1. Open DevTools → Device toolbar
2. Test different screen sizes (mobile, tablet, desktop)
3. Layout should adapt

**Expected**: No broken layout, scrollable content, readable text

## Monitoring Checklist

After deployment, monitor these resources:

### MongoDB Atlas
- Storage used: Should be minimal for fresh install
- Connections: Should show 1-2 from Render backend
- Dashboard: Check for warnings

### Render
- Deploy logs: Should show successful build and startup
- Runtime logs: Check for errors
- CPU/Memory: Should be low on free tier
- Uptime: Should show continuous operation

### Vercel
- Deployment: Should show latest deploy as successful
- Analytics: Can track page views
- Logs: Check for build errors

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| CORS error | Backend origin not allowed | Update `ALLOWED_ORIGINS` on Render |
| 404 on API calls | Wrong API URL | Check `VITE_API_URL` points to Render |
| Blank page | Frontend build failed | Check Vercel build logs |
| API timeout | Backend spun down | Hit backend once to wake it up |
| Database connection error | Wrong connection string | Verify `MONGODB_URI` on Render |
| Images not loading | Broken image paths | Check image URL configuration |

## Testing After Code Changes

1. Make changes locally
2. Test locally: `npm run dev` in frontend, `npm run start:dev` in server
3. Push to GitHub: `git push origin main`
4. Both Vercel and Render auto-deploy
5. Wait for deployments to complete
6. Run tests 1-7 above

## Success Criteria

✅ All 10 tests pass  
✅ No console errors  
✅ API requests successful (200 status)  
✅ Data loads from database  
✅ Cart operations work  
✅ Theme persists  
✅ Mobile responsive  

## Next Steps

If all tests pass:
1. Your app is live and working!
2. Share the Vercel URL with others
3. Monitor logs occasionally
4. Keep making commits to keep services active

If tests fail:
1. Use this guide to diagnose
2. Check logs on Render/Vercel
3. Update environment variables as needed
4. Redeploy services
