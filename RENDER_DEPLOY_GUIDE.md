# QUICK DEPLOY GUIDE - Render.com

## ⚡ Deploy Backend dalam 10 Menit

### Step 1: Prepare Backend
Pastikan file `.env` di server sudah ada atau buat:

```bash
PORT=4000
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_key
GOOGLE_CLIENT_ID=916296934011-5lkhsvb89t4ffgqnfpigva17d7sh0cgd.apps.googleusercontent.com
CLIENT_ORIGIN=https://recipely-e12fc.web.app
```

### Step 2: Buat account di Render
1. Buka: https://render.com
2. Sign up dengan GitHub account
3. Authorize Render untuk akses repository Anda

### Step 3: Create PostgreSQL Database
1. Di dashboard Render, klik **"New +"** → **"PostgreSQL"**
2. Settings:
   - Name: `recipely-db`
   - Database: `recipely`
   - User: `recipely`
   - Region: Singapore (terdekat)
   - Instance Type: **Free**
3. Klik **"Create Database"**
4. Tunggu sampai status "Available"
5. Copy **"External Database URL"** (akan dipakai nanti)

### Step 4: Deploy Backend
1. Klik **"New +"** → **"Web Service"**
2. Connect repository: `IP-HCK88-weldy`
3. Settings:
   - **Name**: `recipely-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Region**: Singapore
   - **Branch**: `dev`
   - **Build Command**: `npm install && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**

4. **Environment Variables** - Klik "Advanced" dan tambahkan:
   ```
   NODE_VERSION=18
   DATABASE_URL=(paste External Database URL dari Step 3)
   JWT_SECRET=your_super_secret_key_here_change_this
   GEMINI_API_KEY=(your actual key)
   GOOGLE_CLIENT_ID=916296934011-5lkhsvb89t4ffgqnfpigva17d7sh0cgd.apps.googleusercontent.com
   CLIENT_ORIGIN=https://recipely-e12fc.web.app
   ```

5. Klik **"Create Web Service"**

### Step 5: Update Database Config
Edit file `server/config/config.json`:
```json
{
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
```

Push changes:
```bash
git add .
git commit -m "Add production database config"
git push origin dev
```

### Step 6: Tunggu Deploy Selesai
- Render akan otomatis build & deploy
- Status bisa dilihat di logs
- Tunggu sampai muncul "Live" (warna hijau)
- Copy URL (contoh: `https://recipely-api.onrender.com`)

### Step 7: Update Client
Edit `client/.env.production`:
```
VITE_API_BASE_URL=https://recipely-api.onrender.com
```

Rebuild & deploy:
```bash
cd client
npm run build
firebase deploy --only hosting
```

### ✅ DONE!
Website sekarang bisa diakses di: https://recipely-e12fc.web.app

---

## ⚠️ CATATAN PENTING:
- Free tier Render akan "sleep" setelah 15 menit tidak ada aktivitas
- First request setelah sleep akan lambat (~30 detik)
- Untuk production, upgrade ke paid plan ($7/month)
