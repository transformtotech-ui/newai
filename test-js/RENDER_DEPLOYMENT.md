# Deploy NestJS API to Render - Step by Step Guide

## Prerequisites
- GitHub account
- Render account (free tier available at https://render.com)
- Your code pushed to a GitHub repository

## Step 1: Push Your Code to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - NestJS API with PostgreSQL"
```

2. Create a new repository on GitHub and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Sign Up / Log In to Render

1. Go to https://render.com
2. Sign up or log in (you can use your GitHub account)

## Step 3: Create a New Web Service

### Option A: Using render.yaml (Recommended)

1. Click **"New +"** button in the top right
2. Select **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click **"Apply"**
6. Your service will start deploying automatically!

### Option B: Manual Setup (Alternative)

1. Click **"New +"** button in the top right
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository
5. Configure the following settings:

   **Basic Settings:**
   - Name: `nestjs-swagger-api` (or your preferred name)
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: Leave blank (or `.` if needed)
   - Runtime: `Node`

   **Build & Deploy:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

   **Plan:**
   - Select **Free** tier (or paid if you prefer)

6. Click **"Advanced"** to add environment variables

## Step 4: Configure Environment Variables

Add the following environment variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://admin:SXtJSHUrtvkOLPbExEolOeMZEUBfGvRi@dpg-d54nnaggjchc7381i9rg-a.virginia-postgres.render.com/nestjstestdb` |
| `NODE_ENV` | `production` |
| `PORT` | (Leave this - Render sets it automatically) |

**To add environment variables:**
1. Scroll to **"Environment Variables"** section
2. Click **"Add Environment Variable"**
3. Enter the key and value
4. Click **"Add"** for each variable

## Step 5: Deploy

1. Click **"Create Web Service"** button
2. Wait for the deployment to complete (this may take 5-10 minutes)
3. Monitor the deployment logs in real-time

## Step 6: Access Your API

Once deployed, Render will provide you with a URL like:
- `https://nestjs-swagger-api.onrender.com`

### Test Your Endpoints:

**Swagger Documentation:**
```
https://YOUR_APP_NAME.onrender.com/api
```

**Hello Endpoint:**
```bash
curl https://YOUR_APP_NAME.onrender.com/hello
```

**Create User:**
```bash
curl -X POST https://YOUR_APP_NAME.onrender.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","address":"123 Main St"}'
```

**Get All Users:**
```bash
curl https://YOUR_APP_NAME.onrender.com/users
```

## Step 7: Auto-Deploy on Push (Optional)

By default, Render auto-deploys when you push to your main branch.

To disable auto-deploy:
1. Go to your service settings
2. Navigate to **"Settings"** tab
3. Scroll to **"Build & Deploy"**
4. Toggle **"Auto-Deploy"** off

## Troubleshooting

### If Deployment Fails:

1. **Check the logs:**
   - Click on **"Logs"** tab in your service dashboard
   - Look for error messages

2. **Common issues:**
   - **Build fails:** Check if all dependencies are in package.json
   - **Database connection fails:** Verify DATABASE_URL is correct
   - **Port issues:** Make sure your app uses `process.env.PORT || 3000`

3. **Restart the service:**
   - Go to **"Manual Deploy"** 
   - Click **"Clear build cache & deploy"**

### Free Tier Limitations:

- Service spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month of runtime (enough for one service)

## Updating Your App

To update your deployed app:

1. Make changes to your code locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```
3. Render will automatically deploy the new version!

## Render Dashboard Features

- **Logs:** Real-time application logs
- **Metrics:** CPU, Memory usage
- **Shell:** SSH into your container
- **Environment:** Manage environment variables
- **Settings:** Configure scaling, regions, etc.

## Next Steps

- Set up a custom domain (available in Render settings)
- Enable HTTPS (automatic with Render)
- Set up health checks
- Configure scaling options

---

## Quick Reference Commands

```bash
# Local development
npm run start:dev

# Build for production
npm run build

# Run production build locally
npm run start:prod

# Push to GitHub (triggers deploy)
git push origin main
```

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
