# 🚀 Deploy Backend ke Render.com

## Langkah-Langkah Deploy (15 menit)

### Step 1: Push Code ke GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin dev
```

### Step 2: Daftar di Render

1. Buka: https://render.com
2. Klik **"Get Started for Free"**
3. Sign up dengan **GitHub** (pilih opsi GitHub untuk lebih mudah)
4. Authorize Render untuk akses GitHub Anda

### Step 3: Create New Web Service

1. Di Dashboard Render, klik **"New +"** → **"Web Service"**
2. Klik **"Connect a repository"**
3. Pilih repository: **"IP-HCK88-weldy"**
4. Klik **"Connect"**

### Step 4: Configure Web Service

Isi form dengan data berikut:

**Basic Settings:**
- **Name:** `recipely-api` (atau nama lain yang Anda suka)
- **Region:** Pilih **Singapore** (paling dekat) atau **Oregon**
- **Branch:** `dev`
- **Root Directory:** `server` ⚠️ PENTING!
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Plan:**
- Pilih **"Free"** (gratis, cukup untuk project ini)

### Step 5: Add Environment Variables

Scroll ke bawah ke bagian **"Environment Variables"**.

Klik **"Add Environment Variable"** dan tambahkan satu per satu:

```
DATABASE_URL
postgresql://postgres.xxxxxxx:xxxxxxxxx@aws-1-us-east-1.pooler.supabase.com:6543/postgres

NODE_ENV
production

PORT
4000

JWT_SECRET
your_jwt_secret_here

JWT_EXPIRES
7d

CLIENT_ORIGIN
https://recipely-e12fc.web.app

GOOGLE_CLIENT_ID
your_google_client_id_here

GOOGLE_CLIENT_SECRET
your_google_client_secret_here

GEMINI_API_KEY
your_gemini_api_key_here
```

⚠️ **PENTING:** Gunakan nilai yang sebenarnya dari file `.env` Anda!

### Step 6: Deploy!

1. Klik **"Create Web Service"** di bagian bawah
2. Tunggu deploy (~3-5 menit)
3. Status akan berubah dari "In Progress" → "Live" ✅

### Step 7: Copy URL Backend

Setelah deploy selesai, Anda akan lihat URL seperti:
```
https://recipely-api-xxxx.onrender.com
```

**COPY URL INI!** Anda akan butuh untuk update client.

---

## Step 8: Update Client dengan URL Render

### A. Update Environment Variable

Edit `client/.env.production`:
```env
VITE_MEALDB_BASE=https://www.themealdb.com
VITE_MEALDB_KEY=1
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_BASE_URL=https://recipely-api-xxxx.onrender.com
```

### B. Create API Config (Recommended)

Create `client/src/config/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/apis/auth/login`,
  REGISTER: `${API_BASE_URL}/apis/auth/register`,
  GOOGLE_LOGIN: `${API_BASE_URL}/apis/auth/google`,
  RECIPES: `${API_BASE_URL}/apis/recipes`,
  MY_RECIPES: `${API_BASE_URL}/apis/recipes/my`,
  RECIPE_BY_ID: (id) => `${API_BASE_URL}/apis/recipes/${id}`,
  CATEGORIES: `${API_BASE_URL}/apis/categories`,
  GENERATE_RECIPE: `${API_BASE_URL}/apis/gemini/generate`,
};

export default API_BASE_URL;
```

### C. Update All Client Files

Di VS Code, tekan `Ctrl+Shift+H` (Find & Replace in Files):

**Find:**
```
http://localhost:4000
```

**Replace with:**
```
https://recipely-api-xxxx.onrender.com
```

(Ganti dengan URL Render Anda yang sebenarnya)

Klik **"Replace All"**

File yang akan terubah:
- `Login.jsx`
- `Register.jsx`
- `AddRecipe.jsx`
- `EditRecipe.jsx`
- `MyRecipes.jsx`
- `PublicMeals.jsx`
- `MealDetail.jsx`

### D. Rebuild & Redeploy Client

```bash
cd client
npm run build
firebase deploy
```

---

## Step 9: Update Google OAuth

1. Buka: https://console.cloud.google.com/apis/credentials
2. Edit OAuth 2.0 Client ID (gunakan ID Anda sendiri)
3. Tambahkan ke **"Authorized JavaScript origins"**:
   ```
   https://recipely-e12fc.web.app
   https://recipely-e12fc.firebaseapp.com
   https://recipely-api-xxxx.onrender.com
   ```
4. Klik **"Save"**
5. Tunggu 5-10 menit untuk propagasi

---

## Step 10: Test! 🎉

1. Buka: https://recipely-e12fc.web.app
2. Coba register akun baru
3. Coba login
4. Browse recipes
5. Add recipe (jika login sebagai chef)

Semuanya seharusnya berhasil! ✅

---

## 🔧 Troubleshooting

### Build Failed di Render?
- Check logs di Render dashboard
- Pastikan `Root Directory` = `server`
- Pastikan semua environment variables sudah ditambahkan

### 502 Bad Gateway?
- Tunggu beberapa menit (cold start pertama kali bisa lama)
- Check logs untuk error

### CORS Error?
- Pastikan `CLIENT_ORIGIN` di environment variables = `https://recipely-e12fc.web.app`
- Restart service di Render

### Database Connection Error?
- Pastikan `DATABASE_URL` format benar
- Test koneksi dari Render logs

---

## 📊 Summary

✅ **Backend:** Deployed di Render  
✅ **Database:** Supabase PostgreSQL  
✅ **Frontend:** Firebase Hosting  
✅ **Total Biaya:** $0 (100% Gratis!)  
✅ **Uptime:** 24/7 (dengan batasan free tier)  

---

## ⚠️ Catatan Penting - Free Tier Render

- ✅ **Gratis selamanya**
- ⚠️ **Sleep setelah 15 menit tidak digunakan**
- ⚠️ **First request setelah sleep butuh ~30 detik untuk wake up**
- ✅ **750 jam/bulan gratis** (cukup untuk 1 bulan penuh)

Untuk keep-alive 24/7 tanpa sleep:
- Upgrade ke paid plan ($7/month), ATAU
- Gunakan cron job untuk ping server setiap 10 menit

---

## 🎯 Checklist

- [ ] Push code ke GitHub
- [ ] Daftar di Render.com
- [ ] Create Web Service
- [ ] Configure (root: `server`, build: `npm install`, start: `npm start`)
- [ ] Add all environment variables
- [ ] Deploy & tunggu selesai
- [ ] Copy Render URL
- [ ] Update `client/.env.production`
- [ ] Find & Replace `localhost:4000` dengan Render URL
- [ ] Rebuild client: `npm run build`
- [ ] Deploy client: `firebase deploy`
- [ ] Update Google OAuth origins
- [ ] Test aplikasi di Firebase URL
- [ ] Login & register berhasil! 🎉

---

**Selamat! Backend Anda sekarang online 24/7!** 🚀
