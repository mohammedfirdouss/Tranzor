# Tranzor Frontend - Real-Time Transaction Management System

A modern, responsive React application for monitoring and managing financial transactions in real-time, built with AWS Cognito authentication, WebSocket connections, and optimized performance.

## 🚀 Features

### ✅ Authentication & Security
- **AWS Cognito Integration**: Secure user authentication with JWT tokens
- **Protected Routes**: Role-based access control with permission checking
- **Automatic Token Refresh**: Seamless session management
- **Secure API Communication**: All requests include authentication headers

### ✅ Real-Time Data
- **WebSocket Connections**: Live transaction feeds with connection status indicators
- **Real-Time Updates**: Instant updates for transactions, fraud alerts, and metrics
- **Connection Management**: Automatic reconnection and error handling
- **Performance Optimized**: Efficient data streaming without UI blocking

### ✅ State Management
- **RTK Query**: Advanced API state management with caching and synchronization
- **Redux Toolkit**: Centralized state management for complex application state
- **Optimistic Updates**: Immediate UI feedback for better user experience
- **Automatic Background Refetching**: Keeps data fresh and synchronized

### ✅ Performance & Scalability
- **Virtualized Tables**: Efficient rendering of large datasets (10,000+ records)
- **Lazy Loading**: On-demand component and data loading
- **Memory Optimization**: Proper cleanup and resource management
- **Responsive Design**: Works seamlessly across desktop and tablet devices

### ✅ User Experience
- **Modern UI**: Clean, professional interface using Ant Design
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels and keyboard navigation
- **Loading States**: Clear feedback during data operations
- **Error Handling**: User-friendly error messages and recovery options

### ✅ Testing
- **Unit Tests**: Comprehensive component testing with React Testing Library
- **Integration Tests**: API integration and user flow testing
- **Test Coverage**: High coverage for critical business logic
- **Mock Services**: Isolated testing with mocked external dependencies

## 🛠 Tech Stack

- **Framework**: React 19 with Vite
- **UI Library**: Ant Design 5
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: AWS Cognito
- **Real-Time**: WebSocket API
- **Virtualization**: @tanstack/react-virtual
- **Testing**: Vitest + React Testing Library
- **Routing**: React Router 6
- **Styling**: CSS-in-JS with Ant Design

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tranzor/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api
   
   # AWS Cognito Configuration - Get these from your AWS Console
   VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
   VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   VITE_AWS_REGION=us-east-1
   
   # WebSocket Configuration - Disabled for now (not implemented in backend)
   VITE_WEBSOCKET_URL=wss://localhost:3001
   ```

4. **Get Cognito Configuration**
   - Deploy the backend first: `cd ../backend/tranzor-api && sam deploy --guided`
   - Copy the Cognito User Pool ID and Client ID from the deployment outputs
   - Update your `.env.local` with the actual values

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests once
npm run test:run
```

### Test Structure
- `src/test/` - Test setup and utilities
- `src/**/__tests__/` - Component-specific tests
- `src/test/setup.js` - Global test configuration

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (VirtualizedTable, etc.)
│   └── forms/          # Form components
├── config/             # Configuration files
│   └── cognito.js      # AWS Cognito configuration
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useApi.js       # API communication
│   ├── useWebSocket.js # WebSocket management
│   └── useRealtimeTransactions.js # Real-time data
├── pages/              # Page components
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── FraudAlertsPage.jsx
│   ├── AuditTrailPage.jsx
│   ├── SettingsPage.jsx
│   └── LoginPage.jsx
├── store/              # Redux store configuration
│   ├── index.js        # Store setup
│   └── api/            # RTK Query API slices
├── test/               # Test files
└── App.jsx             # Main application component
```

## 🔐 Authentication Flow

1. **User visits protected route** → Redirected to login
2. **Login with Cognito** → JWT tokens received
3. **Tokens stored securely** → Automatic API authentication
4. **Route protection** → Permission-based access control
5. **Session management** → Automatic token refresh

## 📡 Real-Time Features

### WebSocket Integration
- **Connection Management**: Automatic connection and reconnection
- **Data Streaming**: Real-time transaction and alert updates
- **Status Monitoring**: Connection health indicators
- **Error Recovery**: Graceful handling of connection failures

### Performance Optimizations
- **Virtual Scrolling**: Efficient rendering of large datasets
- **Debounced Updates**: Prevents excessive re-renders
- **Memory Management**: Proper cleanup of event listeners
- **Background Sync**: Keeps data fresh without blocking UI

## 🎨 UI/UX Features

### Accessibility
- **WCAG 2.1 Compliance**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper heading structure and descriptions
- **Color Contrast**: Meets accessibility standards

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Flexible Layout**: Adapts to different viewport sizes
- **Touch-Friendly**: Proper touch targets and interactions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Ensure all required environment variables are set:
- `VITE_API_BASE_URL` - Production API endpoint
- `VITE_COGNITO_USER_POOL_ID` - AWS Cognito User Pool ID
- `VITE_COGNITO_CLIENT_ID` - AWS Cognito Client ID
- `VITE_AWS_REGION` - AWS Region
- `VITE_WEBSOCKET_URL` - Production WebSocket endpoint

### Deployment Considerations
- **CDN Configuration**: Serve static assets from CDN
- **CORS Settings**: Configure API Gateway CORS for production domain
- **Security Headers**: Implement proper security headers
- **Monitoring**: Set up error tracking and performance monitoring

## 🔧 Development

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety (optional enhancement)

### Performance Monitoring
- **Bundle Analysis**: Monitor bundle size and optimization
- **Performance Metrics**: Track Core Web Vitals
- **Error Tracking**: Monitor and alert on errors

## 📚 API Integration

### Endpoints
- `GET /api/transactions` - Fetch transaction history
- `GET /api/fraud-alerts` - Fetch fraud alerts
- `GET /api/audit-trail` - Fetch audit logs
- `GET /api/metrics` - Fetch system metrics

### Authentication
All API requests include JWT tokens in the Authorization header:
```
Authorization: Bearer <access-token>
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code patterns and conventions
- Write tests for new features
- Ensure accessibility compliance
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information
- Contact the development team

---

**Built with ❤️ for modern financial technology**

## 🔧 Troubleshooting

### Authentication Issues
- **"User does not exist"**: Register a new user first using the registration page
- **"Incorrect email or password"**: Check your credentials or reset password
- **"Please confirm your email"**: Check your email for confirmation code

### CORS Issues
- The backend has CORS configured for the deployed API Gateway
- If you see CORS errors, ensure you're using the correct API URL

### WebSocket Issues
- WebSocket connections are currently disabled as the backend doesn't implement WebSocket support yet
- Real-time features will be added in a future update
- This is normal and won't affect core functionality

### API Connection Issues
- Ensure the backend is deployed and accessible
- Check that your environment variables are correctly set
- Verify the API Gateway URL in your `.env.local` file
