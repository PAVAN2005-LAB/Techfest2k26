# 🚀 Deployment Guide - Publish Your App for Free

Since your application uses a **Node.js Backend** and a **PostgreSQL Database**, you cannot use GitHub Pages. Instead, use **Render.com** (Best Free Tier) or **Vercel**.

---

## 🟢 Option 1: Render (Recommended)
*Best for full-stack Node.js apps like yours.*

### 1. Account Setup
1. Go to [Render.com](https://render.com).
2. Sign up using your **GitHub** account.

### 2. Create Web Service
1. Click **"New +"** button -> **"Web Service"**.
2. Select "Build and deploy from a Git repository".
3. Connect your **`Techfest2k26`** repository.

### 3. Configure Service
Fill in the details:
- **Name:** `techfest-2k26`
- **Region:** Singapore (or nearest to you)
- **Branch:** `main`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

### 4. Environment Variables (Critical!)
You MUST add your secrets here. Scroll down to **"Advanced"** or **"Environment Variables"**.
Add the following keys (copy values from your local `.env`):

| Key | Value |
|-----|-------|
| `DATABASE_URL` | *(Your Neon DB URL)* |
| `RAZORPAY_KEY_ID` | *(Your Key ID)* |
| `RAZORPAY_KEY_SECRET` | *(Your Secret)* |
| `EMAIL_USER` | *(Your Gmail)* |
| `EMAIL_PASS` | *(Your App Password)* |
| `NODE_ENV` | `production` |

### 5. Deploy
- Click **"Create Web Service"**.
- Wait for the build to finish.
- You will get a URL like: `https://techfest-2k26.onrender.com`.

---

## 🟡 Option 2: Vercel
*Faster, but requires code changes.*

1. Create a file named `vercel.json` in root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       },
       {
         "src": "public/**",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   ```
2. Push to GitHub.
3. Import project in Vercel.
4. Add Environmental Variables in Project Settings.

---

## ⚠️ Important Checks after Deployment

1. **Database:** Ensure your Neon DB allows connections from anywhere (usually default).
2. **Razorpay:** If you used `localhost` in Razorpay Dashboard, execute a test payment to assure the callback works.
3. **Prices:** Ensure `events.config.json` is correctly read by checking `/api/events/techfest`.

---

**🎉 Your App is Live!**
Distribute the Render URL to users.
