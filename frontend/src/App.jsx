import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TableOutlined,
  AlertOutlined,
  FileSearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
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

function AppLayout() {
  const location = useLocation();
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
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
        >
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
            Transaction Management System
          </h1>
          <div style={{ color: '#666' }}>
            {/* Add user info, notifications, etc. here */}
          </div>
        </Header>
        <Content 
          style={{ 
            margin: '24px 16px 0', 
            background: '#fff', 
            padding: 24,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/fraud-alerts" element={<FraudAlertsPage />} />
              <Route path="/audit-trail" element={<AuditTrailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    </Router>
  );
}