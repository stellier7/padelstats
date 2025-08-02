# 🚀 Deployment Network Issues - Troubleshooting Guide

## 🔍 **Current Issues Identified**

### 1. **CORS Configuration Problems**
- Backend CORS is set to `localhost:3000` but frontend is deployed on Vercel
- Missing proper production CORS configuration

### 2. **Environment Variables**
- Backend using development environment variables in production
- Missing production-specific configuration

### 3. **API URL Configuration**
- Hardcoded Render URL might have connectivity issues
- No fallback or retry mechanisms

## ✅ **Fixes Applied**

### 1. **Backend CORS Configuration** ✅
- Updated `backend/src/app.ts` with dynamic CORS handling
- Added support for multiple production domains
- Improved CORS error logging

### 2. **Frontend API Service** ✅
- Added retry logic with exponential backoff
- Improved error handling and logging
- Added request timeouts and better debugging

### 3. **Network Diagnostic Tool** ✅
- Created comprehensive diagnostic component
- Tests environment detection, API connectivity, CORS, and authentication
- Added to dashboard for easy access

## 🛠️ **Next Steps to Fix Network Issues**

### Step 1: Update Render Environment Variables
In your Render dashboard, set these environment variables:

```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-here
DATABASE_URL=your-render-postgresql-url
PORT=10000
```

### Step 2: Verify Backend Deployment
1. Check Render logs for any startup errors
2. Ensure the backend is accessible at: `https://padelstats.onrender.com`
3. Test the health endpoint: `https://padelstats.onrender.com/health`

### Step 3: Test Frontend-Backend Connection
1. Open your deployed frontend: `https://padelstats-uvgl.vercel.app`
2. Click "Network Diagnostic" button in the dashboard
3. Run the diagnostic tests to identify specific issues

### Step 4: Common Issues and Solutions

#### Issue: CORS Errors
**Symptoms:** Browser console shows CORS errors
**Solution:** 
- Verify backend CORS configuration includes your Vercel domain
- Check that `NODE_ENV=production` is set in Render

#### Issue: Backend Not Responding
**Symptoms:** Health check fails, 404 or 500 errors
**Solution:**
- Check Render deployment logs
- Verify environment variables are set correctly
- Ensure database connection is working

#### Issue: Authentication Failures
**Symptoms:** Login works but subsequent requests fail
**Solution:**
- Check JWT_SECRET is properly set
- Verify token storage and transmission
- Check authorization headers

## 🔧 **Manual Testing Steps**

### 1. Test Backend Health
```bash
curl https://padelstats.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "environment": "production"
}
```

### 2. Test CORS Configuration
```bash
curl -H "Origin: https://padelstats-uvgl.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://padelstats.onrender.com/health
```

### 3. Test API Endpoints
```bash
# Test authentication endpoint
curl -X POST https://padelstats.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📊 **Monitoring and Debugging**

### 1. Browser Console
- Open Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### 2. Render Logs
- Go to your Render dashboard
- Check the "Logs" tab for backend errors
- Look for startup issues or runtime errors

### 3. Network Diagnostic Tool
- Use the built-in diagnostic tool in your dashboard
- Run all tests to identify specific issues
- Check the detailed error information

## 🚨 **Emergency Fallback**

If network issues persist, your app has demo data fallback:
- Frontend will show demo data when API calls fail
- Users can still see the interface and functionality
- Perfect for demos while fixing backend issues

## 📞 **Support Resources**

1. **Render Documentation:** https://render.com/docs
2. **Vercel Documentation:** https://vercel.com/docs
3. **CORS Guide:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
4. **Network Diagnostic Tool:** Available in your dashboard

## 🎯 **Success Criteria**

Your deployment is working correctly when:
- ✅ Health check returns 200 OK
- ✅ CORS requests are allowed
- ✅ Authentication works end-to-end
- ✅ Match creation and viewing works
- ✅ Real-time features function properly

---

**Next Action:** Deploy the updated backend code and test using the Network Diagnostic tool! 