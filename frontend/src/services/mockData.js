// Mock Data Service for Tranzor Frontend
// This provides realistic data for testing and development

// Generate random transaction data
const generateTransactions = (count = 50) => {
  const transactionTypes = ['PAYMENT', 'TRANSFER', 'WITHDRAWAL', 'DEPOSIT', 'REFUND'];
  const statuses = ['Approved', 'Declined', 'Pending', 'Failed'];
  const merchants = [
    'Amazon.com', 'Walmart', 'Target', 'Best Buy', 'Home Depot',
    'Starbucks', 'McDonald\'s', 'Uber', 'Netflix', 'Spotify',
    'Apple Store', 'Google Play', 'Microsoft', 'Adobe', 'Zoom'
  ];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  
  const transactions = [];
  
  for (let i = 0; i < count; i++) {
    const amount = Math.random() * 1000 + 1;
    const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    transactions.push({
      transactionId: `TXN${String(i + 1).padStart(6, '0')}`,
      accountId: `ACC${String(Math.floor(Math.random() * 1000) + 1).padStart(6, '0')}`,
      amount: parseFloat(amount.toFixed(2)),
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
      status: status,
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      description: `Transaction ${i + 1} - ${transactionTypes[Math.floor(Math.random() * transactionTypes.length)]}`,
      timestamp: timestamp.toISOString(),
      receivedTimestamp: timestamp.toISOString(),
      fraudScore: Math.random() * 100,
      location: {
        country: ['US', 'CA', 'UK', 'DE', 'FR'][Math.floor(Math.random() * 5)],
        city: ['New York', 'Los Angeles', 'Chicago', 'Toronto', 'London'][Math.floor(Math.random() * 5)]
      },
      metadata: {
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        deviceId: `DEV${String(Math.floor(Math.random() * 10000)).padStart(6, '0')}`,
        sessionId: `SESS${String(Math.floor(Math.random() * 100000)).padStart(8, '0')}`
      }
    });
  }
  
  return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate fraud alerts
const generateFraudAlerts = (count = 20) => {
  const alertTypes = ['SUSPICIOUS_ACTIVITY', 'HIGH_RISK_TRANSACTION', 'GEOGRAPHIC_ANOMALY', 'VELOCITY_ALERT', 'AMOUNT_ANOMALY'];
  const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses = ['OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE'];
  
  const alerts = [];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    alerts.push({
      alertId: `ALERT${String(i + 1).padStart(6, '0')}`,
      transactionId: `TXN${String(Math.floor(Math.random() * 1000) + 1).padStart(6, '0')}`,
      accountId: `ACC${String(Math.floor(Math.random() * 1000) + 1).padStart(6, '0')}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severity,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: `Fraud alert ${i + 1} - ${alertTypes[Math.floor(Math.random() * alertTypes.length)]}`,
      timestamp: timestamp.toISOString(),
      riskScore: Math.random() * 100,
      investigator: ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
      notes: Math.random() > 0.5 ? `Investigation notes for alert ${i + 1}` : null,
      resolution: Math.random() > 0.7 ? ['FALSE_POSITIVE', 'CONFIRMED_FRAUD', 'RESOLVED'][Math.floor(Math.random() * 3)] : null
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate audit logs
const generateAuditLogs = (count = 100) => {
  const eventTypes = ['USER_LOGIN', 'USER_LOGOUT', 'TRANSACTION_CREATED', 'TRANSACTION_UPDATED', 'FRAUD_ALERT_CREATED', 'SETTINGS_CHANGED'];
  const users = ['admin@tranzor.com', 'analyst@tranzor.com', 'manager@tranzor.com', 'support@tranzor.com'];
  
  const logs = [];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    logs.push({
      logId: `LOG${String(i + 1).padStart(8, '0')}`,
      eventType: eventType,
      userId: users[Math.floor(Math.random() * users.length)],
      timestamp: timestamp.toISOString(),
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: {
        action: eventType,
        resource: eventType.includes('TRANSACTION') ? `TXN${String(Math.floor(Math.random() * 1000) + 1).padStart(6, '0')}` : null,
        changes: Math.random() > 0.5 ? { field: 'status', oldValue: 'Pending', newValue: 'Approved' } : null
      },
      success: Math.random() > 0.1
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate metrics data
const generateMetrics = () => {
  return {
    currentTps: Math.random() * 100 + 50,
    averageLatency: Math.random() * 200 + 50,
    successRate: Math.random() * 20 + 80,
    totalTransactions: Math.floor(Math.random() * 10000) + 5000,
    activeUsers: Math.floor(Math.random() * 1000) + 100,
    errorRate: Math.random() * 5,
    uptime: Math.random() * 10 + 90,
    cpuUsage: Math.random() * 60 + 20,
    memoryUsage: Math.random() * 70 + 15,
    previousTps: Math.random() * 100 + 40,
    previousLatency: Math.random() * 200 + 60,
    activeAlerts: Math.floor(Math.random() * 5)
  };
};

// Generate chart data for visualizations
const generateChartData = () => {
  const last7Days = [];
  const transactionTypes = ['PAYMENT', 'TRANSFER', 'WITHDRAWAL', 'DEPOSIT'];
  const statuses = ['Approved', 'Declined', 'Pending'];
  const currencies = ['USD', 'EUR', 'GBP'];
  
  // Transaction trends (last 7 days)
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    statuses.forEach(status => {
      last7Days.push({
        date: dateStr,
        status,
        count: Math.floor(Math.random() * 100) + 20
      });
    });
  }
  
  // Transaction volume by type
  const volumeData = [];
  transactionTypes.forEach(type => {
    currencies.forEach(currency => {
      volumeData.push({
        type,
        currency,
        amount: Math.floor(Math.random() * 50000) + 10000
      });
    });
  });
  
  // Transaction distribution
  const distributionData = transactionTypes.map(type => ({
    type,
    value: Math.floor(Math.random() * 100) + 20
  }));
  
  // Fraud score distribution
  const fraudScoreData = [
    { scoreRange: '0-20', count: Math.floor(Math.random() * 50) + 100 },
    { scoreRange: '21-40', count: Math.floor(Math.random() * 30) + 50 },
    { scoreRange: '41-60', count: Math.floor(Math.random() * 20) + 30 },
    { scoreRange: '61-80', count: Math.floor(Math.random() * 15) + 10 },
    { scoreRange: '81-100', count: Math.floor(Math.random() * 10) + 5 }
  ];
  
  // System performance data (last 24 hours)
  const performanceData = {
    tps: [],
    latency: [],
    memory: [],
    cpu: []
  };
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    performanceData.tps.push({
      time: timeStr,
      value: Math.random() * 50 + 30
    });
    
    performanceData.latency.push({
      time: timeStr,
      value: Math.random() * 100 + 50
    });
    
    performanceData.memory.push({
      time: timeStr,
      value: Math.random() * 40 + 30
    });
    
    performanceData.cpu.push({
      time: timeStr,
      value: Math.random() * 60 + 20
    });
  }
  
  return {
    transactionTrends: last7Days,
    transactionVolume: volumeData,
    transactionDistribution: distributionData,
    fraudScoreDistribution: fraudScoreData,
    systemPerformance: performanceData
  };
};

// Generate user data
const generateUsers = () => {
  return [
    {
      userId: 'USR001',
      username: 'john.doe',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'admin',
      status: 'active',
      lastLogin: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      userId: 'USR002',
      username: 'jane.smith',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: 'analyst',
      status: 'active',
      lastLogin: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      userId: 'USR003',
      username: 'mike.johnson',
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      role: 'manager',
      status: 'active',
      lastLogin: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

// Mock API responses with delays to simulate real API calls
const mockApiCall = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Mock data service
export const mockDataService = {
  // Get transactions for an account
  getTransactions: async (accountId, limit = 10) => {
    const allTransactions = generateTransactions(100);
    const filteredTransactions = accountId 
      ? allTransactions.filter(t => t.accountId === accountId)
      : allTransactions;
    
    return mockApiCall({
      transactions: filteredTransactions.slice(0, limit),
      total: filteredTransactions.length,
      accountId: accountId
    });
  },

  // Get a specific transaction
  getTransaction: async (transactionId, accountId) => {
    const allTransactions = generateTransactions(100);
    const transaction = allTransactions.find(t => t.transactionId === transactionId);
    
    return mockApiCall(transaction || null);
  },

  // Get fraud alerts
  getFraudAlerts: async (limit = 20) => {
    const alerts = generateFraudAlerts(limit);
    
    return mockApiCall({
      alerts: alerts,
      total: alerts.length
    });
  },

  // Get audit logs
  getAuditLogs: async (limit = 50) => {
    const logs = generateAuditLogs(limit);
    
    return mockApiCall({
      logs: logs,
      total: logs.length
    });
  },

  // Get real-time metrics
  getMetrics: async (accountId) => {
    const metrics = generateMetrics();
    
    return mockApiCall(metrics);
  },

  // Get chart data for visualizations
  getChartData: async () => {
    const chartData = generateChartData();
    
    return mockApiCall(chartData);
  },

  // Get users
  getUsers: async () => {
    const users = generateUsers();
    
    return mockApiCall({
      users: users,
      total: users.length
    });
  },

  // Create a new transaction
  createTransaction: async (transactionData) => {
    const newTransaction = {
      transactionId: `TXN${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      ...transactionData,
      timestamp: new Date().toISOString(),
      receivedTimestamp: new Date().toISOString(),
      status: 'Pending',
      fraudScore: Math.random() * 100
    };
    
    return mockApiCall(newTransaction);
  },

  // Update transaction status
  updateTransaction: async (transactionId, updates) => {
    return mockApiCall({
      transactionId,
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  // Create fraud alert
  createFraudAlert: async (alertData) => {
    const newAlert = {
      alertId: `ALERT${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      ...alertData,
      timestamp: new Date().toISOString(),
      status: 'OPEN'
    };
    
    return mockApiCall(newAlert);
  },

  // Update fraud alert
  updateFraudAlert: async (alertId, updates) => {
    return mockApiCall({
      alertId,
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }
};

// Export individual generators for direct use
export {
  generateTransactions,
  generateFraudAlerts,
  generateAuditLogs,
  generateMetrics,
  generateUsers
}; 