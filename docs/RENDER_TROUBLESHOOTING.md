# 🛠️ Render Deployment Troubleshooting

If your website on Render ("Service") is not opening or shows "Internal Server Error", follow these steps to fix it.

---

## 🛑 Step 1: Check the Logs (Critical)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click on your **TechFest** service.
3. Click on the **"Logs"** tab on the left.
4. Updates are live. Look for **Red text** or errors.

### Common Errors:

#### ❌ `Error: type "techfest" does not exist`
*   **Cause:** Your database is empty. Tables haven't been created efficiently on the remote DB if you only ran setup locally.
*   **Fix:**
    1.  In Render Dashboard, go to **Shell** (or "Connect").
    2.  Run: `npm run setup`
    3.  This will create the tables in your production Neon database.

#### ❌ `Error: pg_hba.conf rejects connection` or `password authentication failed`
*   **Cause:** Incorrect `DATABASE_URL` in Environment Variables.
*   **Fix:**
    1.  Check **Environment** tab.
    2.  Ensure `DATABASE_URL` matches your Neon connection string exactly.
    3.  Ensure `sslmode=require` is at the end of the URL.

#### ❌ `ReferenceError: process is not defined`
*   **Cause:** You didn't set Environment Variables.
*   **Fix:** Go to **Environment** tab and add `DATABASE_URL`, `RAZORPAY_KEY...`, etc.

#### ❌ `Build failed` / `Module not found`
*   **Cause:** You might have uploaded `node_modules` or have a wrong start command.
*   **Fix:**
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`

---

## 🌍 Step 2: Verify Settings
Go to **Settings** tab:
*   **Build Command:** `npm install`
*   **Start Command:** `node server.js`
*   **Auto-Deploy:** Yes

---

## 📧 Step 3: Database Tables
If the site loads but "Register" fails:
1.  Your **Production Database** (Neon) is different from **Local**.
2.  You must run the setup script **ON RENDER**.
3.  Go to **Shell** tab in Render.
4.  Type: `npm run setup`
5.  Hit Enter. It should say "Tables created successfully".

---

## 🔄 Step 4: Redeploy
If you changed Environment variables:
1.  Go to **Manual Deploy** button.
2.  Select **Deploy latest commit**.

---

## ❓ Still Stuck?
Copy the **latest error from the Logs tab** and paste it here!
