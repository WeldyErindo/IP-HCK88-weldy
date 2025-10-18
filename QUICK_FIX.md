# 🚀 SOLUSI CEPAT: Setup HTTPS di EC2

## Masalah Sekarang
- ❌ Frontend (HTTPS) tidak bisa akses Backend (HTTP) → **Mixed Content Error**

## Solusi
Setup **subdomain dengan HTTPS** untuk backend EC2

---

## LANGKAH CEPAT (30 menit)

### 1️⃣ Setup DNS (Di Cloudflare)
Buat subdomain baru untuk API:

**Dashboard Cloudflare** → **DNS** → **Add Record**:
- Type: `A`
- Name: `api` (atau `backend`)
- Content: `54.206.74.76`
- Proxy status: **DNS only** ☁️ (grey cloud, BUKAN orange!)
- TTL: Auto

Hasil: `api.recipely.weldy.fun` → `54.206.74.76`

### 2️⃣ Login ke EC2 via SSH
```bash
ssh -i your-key.pem ubuntu@54.206.74.76
```

### 3️⃣ Install Nginx + SSL (Copy-paste semua baris ini)
```bash
# Update & Install Nginx
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Node.js + PM2 (jika belum ada)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 4️⃣ Configure Nginx
```bash
# Buat file konfigurasi
sudo nano /etc/nginx/sites-available/recipely-api
```

**Paste ini** (ganti `api.recipely.weldy.fun` dengan domain Anda):
```nginx
server {
    listen 80;
    server_name api.recipely.weldy.fun;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save**: `Ctrl+X` → `Y` → `Enter`

**Aktifkan**:
```bash
sudo ln -s /etc/nginx/sites-available/recipely-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5️⃣ Install SSL Certificate (GRATIS!)
```bash
sudo certbot --nginx -d api.recipely.weldy.fun
```

Jawab pertanyaan:
- Email: (your email)
- Terms: `Y`
- Share email: `N`
- Redirect: `2` (yes, redirect HTTP to HTTPS)

### 6️⃣ Start Backend dengan PM2
```bash
# Navigate ke folder backend
cd /path/to/your/recipely/server

# Install dependencies
npm install

# Start dengan PM2
pm2 start server.js --name recipely-api
pm2 startup
pm2 save

# Cek status
pm2 status
pm2 logs recipely-api
```

### 7️⃣ Test API
```bash
curl https://api.recipely.weldy.fun
```

Harusnya dapat response: `{"message":"Recipely API ok"}`

### 8️⃣ Update Client & Deploy

**Di komputer local**, edit `client/.env.production`:
```env
VITE_MEALDB_BASE=https://www.themealdb.com
VITE_MEALDB_KEY=1
VITE_API_BASE_URL=https://api.recipely.weldy.fun
VITE_GOOGLE_CLIENT_ID=916296934011-5lkhsvb89t4ffgqnfpigva17d7sh0cgd.apps.googleusercontent.com
```

**Rebuild & Deploy**:
```bash
cd client
npm run build
firebase deploy --only hosting
```

### ✅ SELESAI!

Website sekarang bisa diakses:
- 🌐 Frontend: https://recipely-e12fc.web.app
- 🔌 Backend: https://api.recipely.weldy.fun

---

## 🔧 Security Group EC2
Pastikan port terbuka di AWS Console → EC2 → Security Groups:

| Type  | Port | Source    |
|-------|------|-----------|
| SSH   | 22   | Your IP   |
| HTTP  | 80   | 0.0.0.0/0 |
| HTTPS | 443  | 0.0.0.0/0 |

---

## 📝 Troubleshooting

### Cek Nginx:
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Cek SSL:
```bash
sudo certbot certificates
curl -I https://api.recipely.weldy.fun
```

### Cek Backend:
```bash
pm2 status
pm2 logs recipely-api
curl http://localhost:4000
```

### Restart semuanya:
```bash
pm2 restart recipely-api
sudo systemctl restart nginx
```
