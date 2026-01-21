# ⚡ Quick Deployment Commands

## 1️⃣ Push to GitHub
```powershell
cd "c:\Users\Admin\OneDrive\Desktop\authsphere"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/authsphere.git
git branch -M main
git push -u origin main
```

## 2️⃣ Backend on Render
1. render.com → New Web Service
2. Root: `backend`
3. Build: `npm install`
4. Start: `npm start`
5. Add env variables from `.env.example`

## 3️⃣ Frontend on Vercel
1. vercel.com → New Project
2. Root: `frontend`
3. Framework: Vite
4. Add env: `VITE_API_URL=https://your-backend.onrender.com`

## 4️⃣ Update Backend
Update `FRONTEND_URL` in Render with your Vercel URL

## ✅ Done!
Your app is live! 🎉

---

## 📧 Nodemailer Setup (IMPORTANT!)

### Get Gmail App Password:
1. https://myaccount.google.com/apppasswords
2. Create new app password
3. Copy 16-character code
4. Use in `EMAIL_PASSWORD` env variable

### ⚠️ Common Mistakes:
- ❌ Using regular Gmail password → Use App Password
- ❌ No 2FA enabled → Enable it first
- ❌ Wrong email in EMAIL_USER → Use the Gmail that created app password

---

## 🔧 Environment Variables Checklist

### Backend (Render/Railway):
```
✅ PORT=5000
✅ MONGO_URI=your_mongodb_uri
✅ JWT_SECRET=strong_random_string
✅ NODE_ENV=production
✅ SKIP_EMAIL_VERIFICATION=false
✅ EMAIL_SERVICE=gmail
✅ EMAIL_USER=your-email@gmail.com
✅ EMAIL_PASSWORD=16-char-app-password
✅ FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel/Netlify):
```
✅ VITE_API_URL=https://your-backend.onrender.com
```

---

## 🚨 After Each Code Update

```powershell
git add .
git commit -m "Description of changes"
git push
```

Both Render and Vercel will **auto-deploy** from GitHub! 🚀
