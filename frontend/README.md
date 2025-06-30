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

## 🎯 Mock Data System
The application includes a comprehensive mock data system that provides:

- **Realistic Transaction Data**: 100+ sample transactions with various types, statuses, and amounts
- **Fraud Alerts**: 20+ fraud alerts with different severity levels and investigation states
- **Audit Logs**: 100+ audit log entries covering all system activities
- **Real-time Metrics**: Live-updating system metrics and performance data
- **Interactive CRUD Operations**: Create, read, update, and delete functionality for all data types

### 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api
   
   # AWS Cognito Configuration - Get these from your AWS Console
   VITE_COGNITO_USER_POOL_ID=your-user-pool-id
   VITE_COGNITO_CLIENT_ID=your-client-id
   VITE_COGNITO_REGION=us-east-1
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:5173
   - Register a new account or login with existing credentials
   - Start exploring the mock data!

## 🎮 Testing with Mock Data

### Dashboard Testing
1. Navigate to the Dashboard
2. Enter any Account ID (e.g., `ACC000001`) to load mock data
3. View real-time metrics and transaction statistics
4. Click "Create Transaction" to add new transactions
5. Click "View Details" on any transaction to see full information

### Transactions Testing
1. Go to the Transactions page
2. Use the search and filter options to find specific transactions
3. Click "New Transaction" to create test transactions
4. Edit existing transactions by clicking the edit icon
5. View detailed transaction information

### Fraud Alerts Testing
1. Visit the Fraud Alerts page
2. Filter by severity (Critical, High, Medium, Low) and status
3. Create new fraud alerts using the "New Alert" button
4. Update alert status and add investigation notes
5. View risk scores and investigation details

### Audit Trail Testing
1. Check the Audit Trail page
2. Filter by event type, user, and date range
3. View comprehensive logs of all system activities
4. See success/failure status for each event

## 🏗️ Architecture

### Tech Stack
- **React 18** with Vite for fast development
- **Ant Design** for UI components
- **Redux Toolkit Query** for state management and API calls
- **React Router** for navigation
- **AWS Cognito** for authentication
- **Mock Data Service** for testing and demonstration

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── store/              # Redux store and API slices
├── services/           # API services and mock data
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
└── assets/             # Static assets
```

### Mock Data Architecture
- **mockData.js**: Core mock data generators and service
- **mockApi.js**: RTK Query API slice using mock data
- **Realistic Data**: Transactions, alerts, logs, and metrics
- **Interactive Operations**: Full CRUD functionality
- **Real-time Updates**: Simulated live data feeds

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

### Adding New Mock Data
1. Update `src/services/mockData.js` with new data generators
2. Add corresponding API endpoints in `src/store/api/mockApi.js`
3. Update components to use the new mock data

### Switching Between Mock and Real API
- **Mock Mode**: Uses local mock data (current setup)
- **Real API Mode**: Update `src/store/index.js` to use real API slices
- **Environment Variables**: Configure API endpoints in `.env.local`

## 🎨 UI/UX Features

### Accessibility
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Flexible layouts and grids

### User Experience
- Loading states and error handling
- Real-time updates and notifications
- Intuitive navigation and workflows
- Comprehensive filtering and search

## 🔒 Security

### Authentication
- AWS Cognito integration
- JWT token management
- Protected routes
- Session management

### Data Protection
- Input validation and sanitization
- CORS configuration
- Secure API communication
- Mock data isolation

## 📊 Performance

### Optimization
- Code splitting and lazy loading
- Virtualized tables for large datasets
- Efficient state management
- Optimized bundle size

### Monitoring
- Real-time performance metrics
- Error tracking and logging
- User activity monitoring
- System health checks

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Configuration
- Set production API endpoints
- Configure AWS Cognito for production
- Update environment variables
- Enable real-time features

### Deployment Options
- AWS S3 + CloudFront
- Vercel
- Netlify
- Docker containers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the mock data examples
- Test with the provided demo data
- Contact the development team

---

**Happy Testing! 🎉**

The mock data system allows you to fully explore and test all features without needing a backend connection. Try creating transactions, managing fraud alerts, and exploring the audit trail!
