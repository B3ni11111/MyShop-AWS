#!/bin/bash
# Frontend deployment is handled automatically by AWS Amplify Hosting, which
# builds and deploys from the `main` branch on every push. To deploy, just push:
#
#   git push origin main
#
# Live site: https://main.dspu5eyduw64.amplifyapp.com/
#
# The previous S3 + CloudFront path was decommissioned on 2026-06-02
# (CloudFront distribution E53GWBSAXSP4G was deleted). This script is kept only
# as a pointer; there is nothing to run here.
echo "Frontend deploys automatically via AWS Amplify on push to 'main'."
echo "To deploy:  git push origin main"
echo "Live site:  https://main.dspu5eyduw64.amplifyapp.com/"
