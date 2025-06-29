# Tranzor Development Environment

This repository is configured for GitHub Codespaces and VS Code Dev Containers.

## Quick Start

1. **Open in Codespaces**: Click the "Code" button and select "Open with Codespaces"
2. **Or use VS Code**: Install the "Dev Containers" extension and open the folder

## What's Included

- ✅ Node.js 18
- ✅ AWS CLI
- ✅ AWS SAM CLI
- ✅ All necessary VS Code extensions
- ✅ Pre-configured environment variables
- ✅ Development dependencies installed

## Available Commands

- `npm run dev:backend` - Start backend development server
- `npm run dev:frontend` - Start frontend development server
- `npm run deploy` - Deploy to AWS
- `sam build` - Build SAM application
- `sam deploy` - Deploy SAM application

## Environment Variables

The following environment files are automatically created:
- `frontend/.env.local` - Frontend environment variables
- `backend/tranzor-api/.env` - Backend environment variables

## AWS Configuration

Make sure to configure your AWS credentials:
```bash
aws configure
```

## Development Workflow

1. Start the backend: `cd backend/tranzor-api && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Access the application at `http://localhost:5173`
