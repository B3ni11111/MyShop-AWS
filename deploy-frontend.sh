#!/bin/bash
set -e

BUCKET_NAME="myshop-frontend-benny"
DISTRIBUTION_ID="E53GWBSAXSP4G"
CLOUDFRONT_URL="https://dsoobg7wgy1i3.cloudfront.net"

echo "==> Building React app..."
cd front
npm run build
cd ..

echo "==> Syncing to S3..."
aws s3 sync front/dist "s3://$BUCKET_NAME" --delete

echo "==> Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text

echo ""
echo "Deployment complete!"
echo "URL: $CLOUDFRONT_URL"
