#!/bin/bash
set -e

KEY="C:/Users/PC/Downloads/myshopKey.pem"
EC2_USER="ec2-user"
EC2_HOST="174.129.59.241"
PROJECT_DIR="~/React-Shop-MUI--main"

echo "==> Deploying backend to EC2..."
ssh -i "$KEY" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "
  set -e
  cd $PROJECT_DIR
  git fetch origin
  git reset --hard origin/main
  docker compose down
  docker compose up -d
"

echo "Deployment complete!"
