# 🚀 Deploy Backend ke AWS EC2

## Prerequisites

- ✅ EC2 instance sudah running (IP: 54.206.74.76)
- ✅ Anda punya SSH key (.pem file)
- ✅ Security Group sudah allow SSH (port 22)

---

## Step 1: SSH ke EC2

```bash
# Ganti dengan path ke file .pem Anda
ssh -i /path/to/your-key.pem ubuntu@54.206.74.76

# Atau jika user adalah ec2-user:
ssh -i /path/to/your-key.pem ec2-user@54.206.74.76
```

⚠️ **Jika error "Permissions 0644 are too open":**
```bash
chmod 400 /path/to/your-key.pem
```

---

## Step 2: Install Node.js di EC2

```bash
# Update package manager
sudo apt update

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install Git (jika belum ada)
sudo apt install git -y
```

---

## Step 3: Clone Repository

```bash
# Clone repo Anda
git clone https://github.com/WeldyErindo/IP-HCK88-weldy.git

# Masuk ke folder server
cd IP-HCK88-weldy/server

# Install dependencies
npm install
```

---

## Step 4: Setup Environment Variables

```bash
# Buat file .env
nano .env
```

**Isi dengan (copy paste dari .env lokal Anda):**
```env
PORT=4000
CLIENT_ORIGIN=https://recipely-e12fc.web.app

DATABASE_URL=your_database_url_here
NODE_ENV=production

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES=7d

GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

GEMINI_API_KEY=your_gemini_api_key_here
```

⚠️ **Gunakan nilai sebenarnya dari file `.env` lokal Anda!**

**Simpan dan keluar:**
- Tekan `Ctrl+X`
- Tekan `Y`
- Tekan `Enter`

---

## Step 5: Install & Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start server dengan PM2
pm2 start server.js --name recipely-api

# Auto-restart on server reboot
pm2 startup
# (ikuti command yang muncul)

pm2 save

# Check status
pm2 status
pm2 logs recipely-api
```

---

## Step 6: Buka Port 4000 di AWS Security Group

### A. Via AWS Console:

1. Buka: https://console.aws.amazon.com/ec2/
2. Pilih **Instances** → klik instance Anda
3. Tab **Security** → klik **Security Group** name
4. **Edit inbound rules**
5. **Add rule:**
   - **Type:** Custom TCP
   - **Port:** 4000
   - **Source:** 0.0.0.0/0 (atau Anywhere-IPv4)
   - **Description:** Node.js API Server
6. **Save rules**

### B. Via AWS CLI (alternatif):

```bash
# Get security group ID
aws ec2 describe-instances --instance-ids i-xxxxx --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId'

# Add rule
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 4000 \
  --cidr 0.0.0.0/0
```

---

## Step 7: Test Backend

```bash
# Dari EC2 (test lokal)
curl http://localhost:4000/

# Dari komputer Anda (test dari internet)
curl http://54.206.74.76:4000/

# Test API endpoint
curl http://54.206.74.76:4000/apis/categories
```

✅ **Expected response:**
```json
{"message":"Recipely API ok"}
```

---

## Step 8: Setup Firewall (Optional tapi Recommended)

```bash
# Install ufw
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22/tcp

# Allow port 4000
sudo ufw allow 4000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 9: Update Client Firebase

### A. Update semua API URLs

Di VS Code di komputer Anda:

**Find & Replace (Ctrl+Shift+H):**
- Find: `http://localhost:4000`
- Replace: `http://54.206.74.76:4000`
- Replace All

### B. Rebuild & Redeploy

```bash
cd client
npm run build
firebase deploy
```

---

## Step 10: Update Google OAuth

1. Buka: https://console.cloud.google.com/apis/credentials
2. Edit OAuth 2.0 Client ID
3. Tambahkan ke **"Authorized JavaScript origins"**:
   ```
   http://54.206.74.76:4000
   https://recipely-e12fc.web.app
   https://recipely-e12fc.firebaseapp.com
   ```
4. Save & tunggu 5-10 menit

---

## 🔧 PM2 Commands (Useful)

```bash
# Check status
pm2 status

# View logs
pm2 logs recipely-api

# Restart
pm2 restart recipely-api

# Stop
pm2 stop recipely-api

# Delete
pm2 delete recipely-api

# Monitor
pm2 monit

# Update after git pull
cd ~/IP-HCK88-weldy/server
git pull origin dev
npm install
pm2 restart recipely-api
```

---

## 🔧 Troubleshooting

### Server Not Starting?

```bash
# Check logs
pm2 logs recipely-api --lines 50

# Check if port is in use
sudo netstat -tulpn | grep :4000

# Kill process manually
sudo kill -9 $(sudo lsof -t -i:4000)

# Restart
pm2 restart recipely-api
```

### Database Connection Error?

```bash
# Test database connection
cd ~/IP-HCK88-weldy/server
node -e "
const { Sequelize } = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL);
db.authenticate().then(() => console.log('DB OK')).catch(e => console.log('DB Error:', e));
"
```

### Can't Access from Internet?

1. Check Security Group port 4000 is open
2. Check ufw firewall: `sudo ufw status`
3. Check server is running: `pm2 status`
4. Check server is listening: `sudo netstat -tulpn | grep :4000`

---

## 🎯 Summary

Setelah setup selesai:

✅ **Backend:** Running di `http://54.206.74.76:4000`  
✅ **Database:** Supabase PostgreSQL  
✅ **Frontend:** Firebase Hosting (`https://recipely-e12fc.web.app`)  
✅ **Process Manager:** PM2 (auto-restart)  
✅ **Uptime:** 24/7  

---

## ⚠️ Important Notes

### Security:

❌ **HTTP Not Secure:** Backend menggunakan `http://` bukan `https://`
- Google OAuth mungkin warning
- Data tidak terenkripsi

✅ **Untuk Production, sebaiknya:**
1. Setup Nginx sebagai reverse proxy
2. Install SSL certificate (Let's Encrypt gratis)
3. Backend jadi `https://api.yourdomain.com`

### Auto-Deploy Setup (Optional):

```bash
# Setup webhook untuk auto-deploy dari GitHub
cd ~/IP-HCK88-weldy/server
npm install github-webhook-handler

# Create deploy script
nano deploy.sh
```

---

## 🎯 Checklist

- [ ] SSH ke EC2 berhasil
- [ ] Node.js & Git terinstall
- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env` file
- [ ] Install PM2
- [ ] Start server dengan PM2
- [ ] PM2 startup & save
- [ ] Buka port 4000 di Security Group
- [ ] Test dari EC2: `curl localhost:4000`
- [ ] Test dari internet: `curl http://54.206.74.76:4000/`
- [ ] Update client dengan IP EC2
- [ ] Rebuild & redeploy client
- [ ] Update Google OAuth origins
- [ ] Test login/register di Firebase app
- [ ] Berhasil! 🎉

---

## 📞 Quick Reference

**EC2 IP:** 54.206.74.76  
**Backend URL:** http://54.206.74.76:4000  
**Firebase URL:** https://recipely-e12fc.web.app  
**Repository:** https://github.com/WeldyErindo/IP-HCK88-weldy  

**SSH Command:**
```bash
ssh -i /path/to/your-key.pem ubuntu@54.206.74.76
```

**Update Backend:**
```bash
cd ~/IP-HCK88-weldy/server
git pull origin dev
npm install
pm2 restart recipely-api
```

---

**Selamat! Backend Anda sekarang online di AWS EC2!** 🚀
