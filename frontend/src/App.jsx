import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Space } from 'antd';
import {
  DashboardOutlined,
  TableOutlined,
  AlertOutlined,
  FileSearchOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import FraudAlertsPage from './pages/FraudAlertsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import SettingsPage from './pages/SettingsPage';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { 
    key: 'dashboard', 
    icon: <DashboardOutlined />, 
    label: (
      <Link 
        to="/" 
        role="menuitem"
        aria-label="Navigate to Dashboard"
      >
        Dashboard
      </Link>
    )
  },
  { 
    key: 'transactions', 
    icon: <TableOutlined />, 
    label: (
      <Link 
        to="/transactions"
        role="menuitem"
        aria-label="Navigate to Transactions"
      >
        Transactions
      </Link>
    )
  },
  { 
    key: 'fraud', 
    icon: <AlertOutlined />, 
    label: (
      <Link 
        to="/fraud-alerts"
        role="menuitem"
        aria-label="Navigate to Fraud Alerts"
      >
        Fraud Alerts
      </Link>
    )
  },
  { 
    key: 'audit', 
    icon: <FileSearchOutlined />, 
    label: (
      <Link 
        to="/audit-trail"
        role="menuitem"
        aria-label="Navigate to Audit Trail"
      >
        Audit Trail
      </Link>
    )
  },
  { 
    key: 'settings', 
    icon: <SettingOutlined />, 
    label: (
      <Link 
        to="/settings"
        role="menuitem"
        aria-label="Navigate to Settings"
      >
        Settings
      </Link>
    )
  },
];

function getSelectedKey(pathname) {
  if (pathname === '/') return 'dashboard';
  if (pathname.startsWith('/transactions')) return 'transactions';
  if (pathname.startsWith('/fraud-alerts')) return 'fraud';
  if (pathname.startsWith('/audit-trail')) return 'audit';
  if (pathname.startsWith('/settings')) return 'settings';
  return '';
}

function UserMenu() {
  const { user, signOut } = useAuth();

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        // TODO: Navigate to profile page
        console.log('Profile clicked');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: signOut,
    },
  ];

  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Space 
        style={{ cursor: 'pointer', color: '#666' }}
        role="button"
        tabIndex={0}
        aria-label={`User menu for ${user?.name || user?.username || 'User'}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
      >
        <Avatar icon={<UserOutlined />} alt={`Avatar for ${user?.name || user?.username || 'User'}`} />
        <span>{user?.name || user?.username || 'User'}</span>
      </Space>
    </Dropdown>
  );
}

function AppLayout() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
        role="status"
        aria-live="polite"
      >
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        breakpoint="lg" 
        collapsedWidth="0"
        role="navigation"
        aria-label="Main navigation"
      >
        <div 
          style={{ 
            color: '#fff', 
            padding: 16, 
            fontWeight: 'bold', 
            fontSize: 18,
            textAlign: 'center'
          }}
        >
          Tranzor Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          items={menuItems}
          role="navigation"
          aria-label="Main navigation menu"
        />
      </Sider>
      <Layout>
        <Header 
          style={{ 
            background: '#fff', 
            padding: '0 24px', 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)'
          }}
          role="banner"
        >
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            Transaction Management System
          </h1>
          <UserMenu />
        </Header>
        <Content 
          style={{ 
            margin: '24px 16px 0', 
            background: '#fff', 
            padding: 24,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          role="main"
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/transactions" element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              } />
              <Route path="/fraud-alerts" element={
                <ProtectedRoute>
                  <FraudAlertsPage />
                </ProtectedRoute>
              } />
              <Route path="/audit-trail" element={
                <ProtectedRoute>
                  <AuditTrailPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<AppLayout />} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </Provider>
  );
}
