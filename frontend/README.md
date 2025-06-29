# Tranzor Frontend

A React-based administrative dashboard for the Tranzor Real-Time Transaction Processing System.

## Features

- **Real-time Transaction Monitoring**: Live updates of transaction status and metrics
- **Advanced State Management**: RTK Query for efficient API caching and state synchronization
- **Fraud Alert Management**: Real-time fraud detection and alert handling
- **Comprehensive Audit Trail**: Search and filter audit logs with advanced capabilities
- **System Metrics Dashboard**: Real-time performance monitoring and analytics

## Technology Stack

- **React 19.1.0**: Latest React with hooks and modern patterns
- **Redux Toolkit + RTK Query**: Advanced state management and API caching
- **Ant Design 5.26.2**: Professional UI components and design system
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing

## RTK Query Implementation

The application uses RTK Query for efficient API state management with the following features:

### API Structure

```
src/store/
├── index.js                 # Redux store configuration
├── api/
│   ├── baseApi.js          # Base API configuration
│   ├── transactionsApi.js  # Transaction endpoints
│   ├── fraudAlertsApi.js   # Fraud detection endpoints
│   ├── auditTrailApi.js    # Audit log endpoints
│   └── metricsApi.js       # System metrics endpoints
```

### Key Features

- **Automatic Caching**: API responses are cached for 5 minutes (configurable)
- **Real-time Updates**: Polling and cache invalidation for live data
- **Optimistic Updates**: UI updates immediately, rolls back on error
- **Error Handling**: Centralized error management and retry logic
- **Type Safety**: Full TypeScript support (when implemented)

### Usage Examples

```javascript
// Query hook for fetching transactions
const { data, isLoading, error, refetch } = useGetAccountTransactionsQuery({
  accountId: '123',
  limit: 50,
  status: 'Approved'
});

// Mutation hook for creating transactions
const [createTransaction, { isLoading }] = useCreateTransactionMutation();

const handleCreate = async (transactionData) => {
  try {
    await createTransaction(transactionData).unwrap();
    // Cache is automatically updated
  } catch (error) {
    // Handle error
  }
};
```

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# WebSocket Configuration (for future real-time features)
VITE_WS_BASE_URL=ws://localhost:3001

# Authentication Configuration
VITE_AUTH_DOMAIN=your-auth-domain.auth0.com
VITE_AUTH_CLIENT_ID=your-client-id
VITE_AUTH_AUDIENCE=your-api-audience
```

## Development

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## API Endpoints

The frontend expects the following API endpoints:

### Transactions
- `GET /accounts/{accountId}/transactions` - Get account transactions
- `GET /v1/transactions/{transactionId}` - Get transaction details
- `POST /v1/transactions` - Create new transaction
- `PATCH /v1/transactions/{transactionId}` - Update transaction

### Fraud Alerts
- `GET /fraud/alerts/open` - Get open fraud alerts
- `GET /fraud/alerts/{alertId}` - Get fraud alert details
- `POST /fraud/alerts/{alertId}/decision` - Submit fraud decision
- `GET /fraud/stats` - Get fraud statistics

### Audit Trail
- `GET /audit` - Search audit trail
- `GET /audit/{logId}` - Get audit log details
- `GET /audit/transaction/{transactionId}` - Get transaction audit log
- `GET /audit/export` - Export audit logs

### Metrics
- `GET /metrics/system` - Get system metrics
- `GET /metrics/transactions` - Get transaction metrics
- `GET /metrics/fraud` - Get fraud metrics
- `GET /metrics/realtime` - Get real-time metrics

## Performance Optimizations

- **Automatic Polling**: Real-time metrics update every 5 seconds
- **Smart Caching**: Different cache durations for different data types
- **Optimistic Updates**: Immediate UI feedback for mutations
- **Background Refetching**: Data refreshes when window regains focus

## Future Enhancements

- [x] WebSocket integration for real-time updates
- [ ] Virtualization for large data tables
- [ ] Advanced filtering and search capabilities
- [ ] Export functionality for reports
- [ ] User authentication and authorization
- [ ] Dark mode support
- [ ] Mobile responsiveness improvements
