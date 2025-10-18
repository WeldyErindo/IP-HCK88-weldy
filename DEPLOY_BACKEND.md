# Deploy Backend ke Render.com (Gratis + HTTPS)

## Langkah-langkah:

### 1. Push code ke GitHub (jika belum)
```bash
cd server
git add .
git commit -m "Update backend for production"
git push origin dev
```

### 2. Deploy di Render.com
1. Buka https://render.com
2. Sign up / Login dengan GitHub
3. Click "New +" → "Web Service"
4. Connect repository: IP-HCK88-weldy
5. Konfigurasi:
   - **Name**: recipely-api
   - **Root Directory**: server
   - **Runtime**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Instance Type**: Free

### 3. Set Environment Variables di Render
Add these environment variables:
- `PORT`: 4000
- `DATABASE_URL`: (your PostgreSQL URL from Render)
- `JWT_SECRET`: (your secret)
- `GEMINI_API_KEY`: (your key)
- `GOOGLE_CLIENT_ID`: 916296934011-5lkhsvb89t4ffgqnfpigva17d7sh0cgd.apps.googleusercontent.com
- `CLIENT_ORIGIN`: https://recipely-e12fc.web.app

### 4. Setup PostgreSQL Database
1. Di Render dashboard, click "New +" → "PostgreSQL"
2. Copy "External Database URL"
3. Add ke Environment Variables sebagai `DATABASE_URL`

### 5. Update Client .env.production
Setelah deploy selesai, copy URL Render (misalnya: https://recipely-api.onrender.com)
Update file client/.env.production:
```
VITE_API_BASE_URL=https://recipely-api.onrender.com
```

### 6. Rebuild & Redeploy Client
```bash
cd client
npm run build
firebase deploy --only hosting
```

---

## Alternatif: Railway.app
Atau gunakan Railway (https://railway.app) dengan cara yang sama, lebih cepat tapi perlu kartu kredit untuk verifikasi.
