# Setup HTTPS di AWS EC2 dengan Nginx + Let's Encrypt

## Prerequisites
- EC2 instance dengan IP: 54.206.74.76
- Domain/subdomain yang sudah dipoint ke IP EC2 (misal: api.recipely.weldy.fun)
- Port 80 dan 443 terbuka di Security Group

## Step 1: Setup Domain DNS
Di Cloudflare atau DNS provider Anda:
1. Buat A Record:
   - Name: `api` (atau `backend`)
   - Type: `A`
   - Content: `54.206.74.76`
   - Proxy status: DNS only (grey cloud, bukan orange)

## Step 2: Install Nginx di EC2
SSH ke EC2, lalu jalankan:

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 3: Install Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

## Step 4: Configure Nginx untuk Backend
Buat file konfigurasi:
```bash
sudo nano /etc/nginx/sites-available/recipely-api
```

Paste konfigurasi ini (ganti `api.recipely.weldy.fun` dengan domain Anda):
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

Aktifkan konfigurasi:
```bash
sudo ln -s /etc/nginx/sites-available/recipely-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Install SSL Certificate
```bash
sudo certbot --nginx -d api.recipely.weldy.fun
```

Ikuti instruksi:
- Email: masukkan email Anda
- Terms: Y (yes)
- Share email: N (no)
- Redirect HTTP to HTTPS: 2 (yes)

## Step 6: Setup Auto-renewal
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Sudah otomatis di crontab, tapi bisa cek:
sudo systemctl status certbot.timer
```

## Step 7: Install PM2 untuk Keep Backend Running
```bash
# Install Node.js (jika belum)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Navigate ke folder server
cd /path/to/your/server

# Install dependencies
npm install

# Start dengan PM2
pm2 start server.js --name recipely-api

# Auto-start on boot
pm2 startup
pm2 save
```

## Step 8: Setup Environment Variables di EC2
```bash
# Edit .env file
nano .env
```

Isi dengan:
```env
PORT=4000
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_key
GOOGLE_CLIENT_ID=916296934011-5lkhsvb89t4ffgqnfpigva17d7sh0cgd.apps.googleusercontent.com
CLIENT_ORIGIN=https://recipely-e12fc.web.app
DATABASE_URL=postgresql://user:password@localhost:5432/recipely
NODE_ENV=production
```

## Step 9: Setup PostgreSQL di EC2 (jika belum)
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Switch to postgres user
sudo -u postgres psql

# Di PostgreSQL prompt:
CREATE DATABASE recipely;
CREATE USER recipely_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE recipely TO recipely_user;
\q

# Update connection
# Edit config/config.json atau gunakan DATABASE_URL di .env
```

## Step 10: Run Migrations & Seeds
```bash
cd /path/to/server
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Step 11: Restart Backend
```bash
pm2 restart recipely-api
pm2 logs recipely-api
```

## Step 12: Update Client
Edit `client/.env.production`:
```env
VITE_API_BASE_URL=https://api.recipely.weldy.fun
```

Rebuild & deploy:
```bash
cd client
npm run build
firebase deploy --only hosting
```

## Troubleshooting

### Check Nginx status:
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check SSL certificate:
```bash
sudo certbot certificates
```

### Check PM2:
```bash
pm2 status
pm2 logs recipely-api
```

### Check firewall:
```bash
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
```

### Test API:
```bash
curl https://api.recipely.weldy.fun
```

## Security Group Rules (AWS Console)
Pastikan EC2 Security Group memiliki:
- Port 22 (SSH) - Your IP
- Port 80 (HTTP) - 0.0.0.0/0
- Port 443 (HTTPS) - 0.0.0.0/0
- Port 5432 (PostgreSQL) - jika eksternal DB
