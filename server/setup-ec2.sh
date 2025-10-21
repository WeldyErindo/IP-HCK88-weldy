#!/bin/bash
# SETUP EC2 - Copy paste script ini di terminal EC2

echo "🚀 Starting EC2 Setup for Recipely Backend..."

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Nginx
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# 3. Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# 4. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 5. Install PM2
sudo npm install -g pm2

# 6. Install PostgreSQL (if needed)
sudo apt install postgresql postgresql-contrib -y

echo "✅ Base installation complete!"
echo ""
echo "Next steps:"
echo "1. Setup DNS: Point api.recipely.weldy.fun to this server IP"
echo "2. Configure Nginx (see below)"
echo "3. Install SSL with: sudo certbot --nginx -d api.recipely.weldy.fun"
