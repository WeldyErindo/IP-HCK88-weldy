#!/bin/bash

# EC2 Quick Setup Script
# Run this script on your EC2 instance

echo "=== Recipely Backend EC2 Setup ==="
echo ""

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Certbot
echo "🔒 Installing Certbot..."
sudo apt install certbot python3-certbot-nginx -y

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
echo "🔄 Installing PM2..."
sudo npm install -g pm2

# Install PostgreSQL
echo "🗄️  Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo ""
echo "✅ Basic installation complete!"
echo ""
echo "Next steps:"
echo "1. Setup your domain DNS to point to this server IP"
echo "2. Configure Nginx (see EC2_HTTPS_SETUP.md)"
echo "3. Install SSL certificate with: sudo certbot --nginx -d your-domain.com"
echo "4. Clone your repository and setup the backend"
echo "5. Start backend with PM2"
