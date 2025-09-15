
# 🚀 Deploy to Render.com (Free Tier)

## Quick Setup Instructions

### Step 1: Create Render Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Connect to GitHub and select this repository: REPOSITORY_URL
5. Use branch: **BRANCH_NAME**

### Step 2: Configure Service Settings
- **Name**: test-contact-manager
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: Free

### Step 3: Environment Variables
Add these environment variables in Render service settings:

```
NODE_ENV=production
NEXT_PUBLIC_SHEETAPPS_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SHEETAPPS_API_KEY=sk_test_123456789
NEXT_PUBLIC_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
NEXT_PUBLIC_SHEET_HEADERS=["Name","Email","Status","Created Date"]
NEXT_PUBLIC_SHEET_DATA_TYPES={"Name":"text","Email":"email","Status":"text","Created Date":"date"}
NEXT_PUBLIC_APP_NAME=Test Contact Manager
NEXT_PUBLIC_APP_DESCRIPTION=A test contact management app for Render deployment
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for build and deployment (5-10 minutes)
- Your app will be live at: `https://your-service-name.onrender.com`

## 🔄 Auto-Deploy Setup (Optional)
Render automatically redeploys when you push to the **BRANCH_NAME** branch.

## 📞 Support
- Repository: REPOSITORY_URL
- Generated: 9/15/2025
- SheetApps Support: [Contact Us](mailto:support@sheetapps.com)
