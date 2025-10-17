# ⚡ Quick Deploy ke AWS EC2 - Command Cheat Sheet

## 1. SSH ke EC2
```bash
ssh -i your-key.pem ubuntu@54.206.74.76
```

## 2. Install Node.js
```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git
node --version
```

## 3. Clone & Setup
```bash
git clone https://github.com/WeldyErindo/IP-HCK88-weldy.git
cd IP-HCK88-weldy/server
npm install
```

## 4. Create .env
```bash
nano .env
```
Paste isi dari .env lokal Anda, lalu:
- Ctrl+X → Y → Enter

## 5. Install PM2 & Run
```bash
sudo npm install -g pm2
pm2 start server.js --name recipely-api
pm2 startup
pm2 save
pm2 status
```

## 6. Buka Port 4000 di AWS Console
- EC2 → Security Groups
- Edit Inbound Rules
- Add: TCP 4000, Source: 0.0.0.0/0
- Save

## 7. Test
```bash
# Di EC2
curl http://localhost:4000/

# Di komputer Anda
curl http://54.206.74.76:4000/
```

## 8. Update Client
```bash
# Di komputer Anda
cd client

# Find & Replace in VS Code:
# localhost:4000 → 54.206.74.76:4000

npm run build
firebase deploy
```

## ✅ Done! Backend online di: http://54.206.74.76:4000

---

## Useful PM2 Commands
```bash
pm2 status                    # Cek status
pm2 logs recipely-api         # Lihat logs
pm2 restart recipely-api      # Restart
pm2 stop recipely-api         # Stop
pm2 monit                     # Monitor realtime
```

## Update Backend After Git Push
```bash
cd ~/IP-HCK88-weldy/server
git pull origin dev
npm install
pm2 restart recipely-api
```
