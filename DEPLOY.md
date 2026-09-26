# 🚀 SkillTrack — Deploy to Vercel + Render

> Frontend on **Vercel** + Backend on **Render** — both FREE

---

## 📦 Step 1 — Push to GitHub

Open PowerShell in `D:\skilltrack`:

```bash
git init
git add .
git commit -m "SkillTrack initial commit"
```

Go to [github.com/new](https://github.com/new) → create repo `skilltrack` → then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/skilltrack.git
git push -u origin main
```

---

## 🔵 Step 2 — Deploy Backend → Render.com (Free)

1. Go to **[render.com](https://render.com)** → Sign up
2. **New → Web Service** → Connect GitHub → select `skilltrack`
3. Settings:
   - **Root Directory:** `server`
   - **Build:** `npm install`
   - **Start:** `node index.js`
   - **Plan:** Free
4. **Environment Variables:**
   - `JWT_SECRET` = `any_random_secret_key`
   - `NODE_ENV` = `production`
5. **Disks** → Add Disk:
   - Mount Path: `/opt/render/project/src/data`
   - Size: 1 GB
6. Deploy → get URL like `https://skilltrack-api.onrender.com`

---

## 🟡 Step 3 — Deploy Frontend → Vercel.com (Free)

1. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
2. **Add New Project** → Import `skilltrack`
3. Settings:
   - **Root Directory:** `client`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output:** `dist`
4. **Environment Variables:**
   - `VITE_API_URL` = `https://skilltrack-api.onrender.com`
5. Deploy → get URL like `https://skilltrack.vercel.app`

---

## 🔄 Step 4 — Allow Vercel in Backend CORS

Edit `D:\skilltrack\server\index.js`:

```js
app.use(cors({
  origin: ['https://skilltrack.vercel.app', 'http://localhost:5173'],
}));
```

`git add . && git commit -m "fix cors" && git push` → Render auto-redeploys.

---

## ✅ Final URLs

| | URL |
|---|---|
| 🌐 Live Site | `https://skilltrack.vercel.app` |
| ⚙️ API | `https://skilltrack-api.onrender.com` |

Every `git push` auto-deploys both services!
