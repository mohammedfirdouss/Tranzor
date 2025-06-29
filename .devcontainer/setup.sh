#!/bin/bash

# Tranzor Dev Container Setup Script
# This script runs when the dev container is created

set -e

echo "Setting up Tranzor development environment in container..."

# Install AWS SAM CLI
install_sam_cli() {
    echo "Installing AWS SAM CLI..."
    
    if command -v sam &> /dev/null; then
        echo "✅ SAM CLI already installed: $(sam --version)"
        return
    fi
    
    # Install SAM CLI for Linux
    wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
    unzip -q aws-sam-cli-linux-x86_64.zip -d sam-installation
    sudo ./sam-installation/install
    rm -rf sam-installation aws-sam-cli-linux-x86_64.zip
    
    echo "✅ SAM CLI installed successfully"
}

# Install Node.js dependencies
install_dependencies() {
    echo "Installing Node.js dependencies..."
    
    # Backend dependencies
    if [[ -d "backend/tranzor-api" ]]; then
        echo "Installing backend dependencies..."
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
        echo "Creating backend .env file..."
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

# Setup Git configuration
setup_git() {
    echo "🔧 Setting up Git configuration..."
    
    # Configure Git if not already configured
    if [[ -z "$(git config --global user.name)" ]]; then
        git config --global user.name "Tranzor Developer"
        git config --global user.email "developer@tranzor.com"
    fi
}

# Main execution
main() {
    install_sam_cli
    install_dependencies
    setup_env
    setup_git
    
    echo ""
    echo "🎉 Dev container setup complete!"
    echo ""
    echo "Available commands:"
    echo "   - npm run dev:backend    # Start backend development server"
    echo "   - npm run dev:frontend   # Start frontend development server"
    echo "   - npm run deploy         # Deploy to AWS"
    echo ""
    echo "🔧 Environment ready for development!"
}

main "$@"
