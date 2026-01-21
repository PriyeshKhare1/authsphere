# 🚀 AuthSphere Deployment Guide

## ✅ Quick Answer: YES, Nodemailer WILL work in deployment!

You just need to use a **Gmail App Password** (not your regular password).

---

## 📋 Prerequisites

1. **GitHub Account** - [github.com](https://github.com)
2. **Gmail Account** - For sending emails
3. **Hosting Accounts** (Free tiers available):
   - Backend: [Render](https://render.com) or [Railway](https://railway.app)
   - Frontend: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

---

## 🔐 Step 0: Setup Gmail App Password (IMPORTANT!)

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Google account
3. Create a new App Password:
   - App: Mail
   - Device: Windows Computer
4. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
5. You'll use this as `EMAIL_PASSWORD` (not your Gmail password!)

---

## 📤 Step 1: Upload to GitHub

### 1.1 Create GitHub Repository

1. Go to https://github.com
2. Click **"New"** or **"+"** → **"New repository"**
3. Name: `authsphere`
4. Keep it **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click **"Create repository"**

### 1.2 Push Code to GitHub

Open PowerShell in VS Code terminal and run:

```powershell
# Navigate to project
cd "c:\Users\Admin\OneDrive\Desktop\authsphere"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AuthSphere project"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/authsphere.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## 🖥️ Step 2: Deploy Backend

### Option A: Render (Recommended - Free)

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. Click **"New +"** → **"Web Service"**
4. **Connect your repository** → Select `authsphere`
5. **Configure**:

   | Setting | Value |
   |---------|-------|
   | Name | `authsphere-backend` |
   | Region | Choose closest to you |
   | Root Directory | `backend` |
   | Runtime | `Node` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |

6. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://youtubepk:password79999@cluster0.8ayjdjd.mongodb.net/AuthSphere
   JWT_SECRET=authsphere_super_secret_key_change_this_in_production
   NODE_ENV=production
   SKIP_EMAIL_VERIFICATION=false
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password-here
   FRONTEND_URL=https://will-update-after-frontend-deployment.com
   ```

7. Click **"Create Web Service"**
8. Wait 2-5 minutes for deployment
9. **📝 COPY YOUR BACKEND URL**: (e.g., `https://authsphere-backend.onrender.com`)

---

### Option B: Railway.app (Alternative)

1. Go to https://railway.app
2. Sign up with GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Select `authsphere` repo
5. Click **"Add variables"** → Add same environment variables as Render
6. Set **Root Directory** to `backend`
7. Deploy
8. Copy your backend URL

---

## 🌐 Step 3: Deploy Frontend

### Vercel (Recommended)

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. Click **"Add New..."** → **"Project"**
4. **Import** your `authsphere` repository
5. **Configure**:

   | Setting | Value |
   |---------|-------|
   | Framework Preset | `Vite` |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

6. **Environment Variables** → Add:
   ```
   VITE_API_URL=https://authsphere-backend.onrender.com
   ```
   ⚠️ Replace with YOUR actual backend URL from Step 2!

7. Click **"Deploy"**
8. Wait 1-2 minutes
9. **📝 COPY YOUR FRONTEND URL**: (e.g., `https://authsphere.vercel.app`)

---

## 🔄 Step 4: Update Backend Environment

**Important**: Now that you have your frontend URL, update the backend:

1. Go back to **Render** (or Railway)
2. Open your **authsphere-backend** service
3. Go to **Environment** → Find `FRONTEND_URL`
4. **Update** with your actual frontend URL:
   ```
   FRONTEND_URL=https://authsphere.vercel.app
   ```
5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

## ✅ Step 5: Test Your Deployment

1. **Open your frontend URL** in browser
2. **Try signing up** with a new email
3. **Check email** for verification link
4. **Test all features**:
   - Sign in
   - Create tasks
   - Check dashboard
   - Test attendance

---

## 🐛 Troubleshooting

### Email not working?
- ✅ Make sure you used **App Password**, not regular password
- ✅ Enable 2FA on Gmail first
- ✅ Check EMAIL_USER and EMAIL_PASSWORD are correct
- ✅ Check Render logs for errors

### CORS errors?
- ✅ Make sure FRONTEND_URL in backend matches your actual frontend URL
- ✅ No trailing slash in URLs

### Backend not connecting to frontend?
- ✅ Check VITE_API_URL in Vercel matches backend URL
- ✅ Redeploy frontend after changing env variables

### Database errors?
- ✅ Check MONGO_URI is correct
- ✅ Make sure MongoDB allows connections from anywhere (0.0.0.0/0)

---

## 📱 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://authsphere.vercel.app`
- **Backend API**: `https://authsphere-backend.onrender.com`
- **API Endpoints**: `https://authsphere-backend.onrender.com/api/auth/signin`

---

## 🔒 Security Recommendations

### Before Production:

1. **Change JWT_SECRET** to a strong random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update MongoDB User** with a stronger password

3. **Enable MongoDB IP Whitelist** (if not using 0.0.0.0/0)

4. **Add rate limiting** to prevent abuse

5. **Use HTTPS only** (both Render and Vercel provide this automatically)

---

## 💰 Cost

**Everything can be FREE!**

- ✅ GitHub: Free
- ✅ Render: Free tier (may sleep after inactivity)
- ✅ Vercel: Free tier (perfect for frontend)
- ✅ MongoDB Atlas: Free tier (512MB)

---

## 🎉 Done!

Your app is now live and accessible worldwide!

**Need help?** Check:
- Render logs: Dashboard → Logs
- Vercel logs: Deployment → Function Logs
- Browser console: F12 → Console

---

## 📞 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Backend sleeping" on Render | Free tier sleeps after 15min inactivity. First request wakes it (30s delay) |
| Email verification not working | Use Gmail App Password, enable 2FA first |
| CORS errors | Update FRONTEND_URL in backend env variables |
| Build fails | Check Node version compatibility |
| Socket.io not connecting | Make sure both URLs use HTTPS |

---

**Remember**: First deployment takes time. Subsequent updates are automatic via GitHub pushes!
