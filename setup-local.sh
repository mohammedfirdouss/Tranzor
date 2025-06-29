#!/bin/bash

# Tranzor Local Development Setup Script
# This script installs AWS CLI and SAM CLI for local development

set -e

echo "🚀 Setting up Tranzor development environment..."

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi

echo "📋 Detected OS: $OS"

# Install AWS CLI
install_aws_cli() {
    echo "🔧 Installing AWS CLI..."
    
    if command -v aws &> /dev/null; then
        echo "✅ AWS CLI already installed: $(aws --version)"
        return
    fi
    
    if [[ "$OS" == "linux" ]]; then
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip -q awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
    elif [[ "$OS" == "macos" ]]; then
        curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
        sudo installer -pkg AWSCLIV2.pkg -target /
        rm AWSCLIV2.pkg
    elif [[ "$OS" == "windows" ]]; then
        echo "⚠️  Please install AWS CLI manually on Windows:"
        echo "   https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html"
        return
    fi
    
    echo "✅ AWS CLI installed successfully"
}

# Install SAM CLI
install_sam_cli() {
    echo "🔧 Installing AWS SAM CLI..."
    
    if command -v sam &> /dev/null; then
        echo "✅ SAM CLI already installed: $(sam --version)"
        return
    fi
    
    if [[ "$OS" == "linux" ]]; then
        wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
        unzip -q aws-sam-cli-linux-x86_64.zip -d sam-installation
        sudo ./sam-installation/install
        rm -rf sam-installation aws-sam-cli-linux-x86_64.zip
    elif [[ "$OS" == "macos" ]]; then
        brew install aws-sam-cli
    elif [[ "$OS" == "windows" ]]; then
        echo "⚠️  Please install SAM CLI manually on Windows:"
        echo "   https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
        return
    fi
    
    echo "✅ SAM CLI installed successfully"
}

# Install Node.js dependencies
install_dependencies() {
    echo "🔧 Installing Node.js dependencies..."
    
    # Backend dependencies
    if [[ -d "backend/tranzor-api" ]]; then
        echo "🔧 Installing backend dependencies..."
        cd backend/tranzor-api
        npm install
        cd ../..
    fi
    
    # Frontend dependencies
    if [[ -d "frontend" ]]; then
        echo "📁 Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
    fi
    
    echo "✅ Dependencies installed successfully"
}

# Setup environment variables
setup_env() {
    echo "🔧 Setting up environment variables..."
    
    # Create .env file for frontend if it doesn't exist
    if [[ ! -f "frontend/.env.local" ]]; then
        echo "📝 Creating frontend .env.local file..."
        cat > frontend/.env.local << EOF
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Development Configuration
VITE_DEV_MODE=true
EOF
        echo "✅ Created frontend/.env.local"
    fi
    
    # Create .env file for backend if it doesn't exist
    if [[ ! -f "backend/tranzor-api/.env" ]]; then
        echo "📝 Creating backend .env file..."
        cat > backend/tranzor-api/.env << EOF
# AWS Configuration
AWS_REGION=us-east-1
AWS_PROFILE=default

# DynamoDB Configuration
TRANSACTIONS_TABLE_NAME=Transactions

# API Configuration
API_STAGE=dev
EOF
        echo "✅ Created backend/tranzor-api/.env"
    fi
}

# Main execution
main() {
    install_aws_cli
    install_sam_cli
    install_dependencies
    setup_env
    
    echo ""
    echo "🎉 Setup complete! Your development environment is ready."
    echo ""
    echo "📋 Next steps:"
    echo "   1. Configure AWS credentials: aws configure"
    echo "   2. Start backend: cd backend/tranzor-api && npm run dev"
    echo "   3. Start frontend: cd frontend && npm run dev"
    echo ""
    echo "🔧 Available commands:"
    echo "   - ./deploy.sh          # Deploy to AWS"
    echo "   - ./deploy-frontend.sh # Deploy frontend only"
    echo "   - ./deploy-backend.sh  # Deploy backend only"
}

main "$@"
