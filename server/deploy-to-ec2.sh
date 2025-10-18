#!/bin/bash

# Deploy to EC2 Script
# Usage: ./deploy-to-ec2.sh

# Configuration - EDIT THESE VALUES
EC2_USER="ubuntu"  # or ec2-user for Amazon Linux
EC2_HOST="54.206.74.76"
EC2_KEY="~/.ssh/your-key.pem"  # Path to your SSH key
REMOTE_DIR="/home/ubuntu/recipely"  # Directory on EC2

echo "🚀 Deploying Recipely Backend to EC2..."
echo ""

# 1. Copy files to EC2
echo "📦 Copying files to EC2..."
rsync -avz --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'logs' \
  --exclude '.env' \
  -e "ssh -i $EC2_KEY" \
  ./ ${EC2_USER}@${EC2_HOST}:${REMOTE_DIR}/

# 2. SSH and run commands
echo "⚙️  Installing dependencies and restarting server..."
ssh -i $EC2_KEY ${EC2_USER}@${EC2_HOST} << 'EOF'
  cd /home/ubuntu/recipely
  
  # Install dependencies
  npm install
  
  # Run migrations (if needed)
  npx sequelize-cli db:migrate
  
  # Restart with PM2
  pm2 restart recipely-api || pm2 start ecosystem.config.js
  
  # Show status
  pm2 status
  pm2 logs recipely-api --lines 20
EOF

echo ""
echo "✅ Deployment complete!"
echo "Check logs with: ssh -i $EC2_KEY ${EC2_USER}@${EC2_HOST} 'pm2 logs recipely-api'"
