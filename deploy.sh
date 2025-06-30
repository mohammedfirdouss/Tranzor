#!/bin/bash

# Tranzor Full Deployment Script
# Deploys both backend and frontend to AWS

set -e

echo "🚀 Starting Tranzor deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please run ./setup-local.sh first"
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI not found. Please run ./setup-local.sh first"
    exit 1
fi

# Deploy backend
echo "📦 Deploying backend..."
cd backend/tranzor-api
sam build
# Run sam deploy, but allow exit code 0 (success) or 255 (no changes) to continue
echo "Deploying backend with SAM..."
sam deploy || [ $? -eq 255 ]
cd ../..

# Wait for backend resources to be fully available
sleep 15

# Get API Gateway URL from SAM output
API_URL=$(aws cloudformation describe-stacks --stack-name Tranzor --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)

# Get Cognito UserPoolId and ClientId from SAM output
USER_POOL_ID=$(aws cloudformation describe-stacks --stack-name Tranzor --query 'Stacks[0].Outputs[?contains(OutputKey, `UserPoolId`)].OutputValue' --output text)
CLIENT_ID=$(aws cloudformation describe-stacks --stack-name Tranzor --query 'Stacks[0].Outputs[?contains(OutputKey, `ClientId`)].OutputValue' --output text)

# Update frontend environment with API URL and Cognito values
echo "🔧 Updating frontend environment..."
cat > frontend/.env.production << EOF
VITE_API_BASE_URL=$API_URL
VITE_COGNITO_USER_POOL_ID=$USER_POOL_ID
VITE_COGNITO_CLIENT_ID=$CLIENT_ID
VITE_DEV_MODE=false
EOF

# Deploy frontend
echo "📦 Deploying frontend..."
cd frontend
npm install
npm run build

# Deploy to S3/CloudFront (you'll need to set up S3 bucket and CloudFront distribution)
echo "⚠️  Frontend build complete. Please deploy to your S3 bucket manually or set up automated deployment."
echo "   Build files are in: frontend/dist/"
cd ..

echo "✅ Deployment complete!"
echo "🌐 API URL: $API_URL"
