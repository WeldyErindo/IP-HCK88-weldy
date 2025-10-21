# Quick EC2 Setup Guide

## 1️⃣ Setup DNS di Cloudflare
Buat A Record:
- Name: `api`
- Type: `A`
- Content: `54.206.74.76`
- Proxy: OFF (grey cloud)

Result: `api.recipely.weldy.fun` → `54.206.74.76`

## 2️⃣ SSH ke EC2
```bash
ssh -i your-key.pem ubuntu@54.206.74.76
```

## 3️⃣ Install Dependencies
```bash
# Copy paste script ini:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install tools
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
sudo npm install -g pm2
```

## 4️⃣ Clone & Setup Backend
```bash
cd ~
git clone https://github.com/WeldyErindo/IP-HCK88-weldy.git
cd IP-HCK88-weldy/server
npm install
```

## 5️⃣ Setup .env di EC2
```bash
nano .env
```

Isi dengan:
```env
PORT=4000
NODE_ENV=production
JWT_SECRET=your_secret_key_change_this
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_ORIGIN=https://recipely-e12fc.web.app
DATABASE_URL=your_database_url_here
```

## 6️⃣ Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/recipely
```

Paste ini:
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

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/recipely /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7️⃣ Install SSL Certificate
```bash
sudo certbot --nginx -d api.recipely.weldy.fun
```

Answer:
- Email: (your email)
- Terms: Y
- Share: N
- Redirect: 2 (yes)

## 8️⃣ Start Backend with PM2
```bash
cd ~/IP-HCK88-weldy/server
pm2 start server.js --name recipely-api
pm2 startup
pm2 save
```

## 9️⃣ Setup Firewall (Security Group di AWS)
Di AWS Console → EC2 → Security Groups:
- Port 22 (SSH) - Your IP
- Port 80 (HTTP) - 0.0.0.0/0
- Port 443 (HTTPS) - 0.0.0.0/0

## 🔟 Test
```bash
curl https://api.recipely.weldy.fun
```

## ✅ Done!
Client sudah dikonfigurasi untuk connect ke: `https://api.recipely.weldy.fun`

Tinggal rebuild & deploy:
```bash
cd client
npm run build
firebase deploy --only hosting
```
