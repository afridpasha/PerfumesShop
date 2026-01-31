# Quick Deployment Commands

## Push Changes to Git

```bash
# Navigate to project root
cd c:\Projects\PerfumesProject

# Add new files
git add client/public/_redirects
git add client/.env.production
git add DEPLOYMENT_FIX.md
git add QUICK_DEPLOY.md

# Commit changes
git commit -m "Fix: Frontend routing and production API configuration"

# Push to repository
git push origin main
```

## Render Will Auto-Deploy

After pushing, Render will automatically:
1. Detect changes
2. Rebuild frontend with new files
3. Deploy updated version

## Test URLs

**Frontend:** https://perfumesshop-8ftg.onrender.com
**Backend API:** https://perfumesshop.onrender.com/api

## Quick Test Commands

```bash
# Test backend health
curl https://perfumesshop.onrender.com/health

# Test API perfumes endpoint
curl https://perfumesshop.onrender.com/api/perfumes
```

## If Issues Persist

1. Check Render Dashboard logs
2. Verify environment variables are set
3. Clear build cache and redeploy
4. Check browser console for errors

## Files Created
- ✅ `client/public/_redirects` - Handles React Router on static host
- ✅ `client/.env.production` - Production API URL configuration
