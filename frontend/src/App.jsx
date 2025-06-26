import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TableOutlined,
  AlertOutlined,
  FileSearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import FraudAlertsPage from './pages/FraudAlertsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import SettingsPage from './pages/SettingsPage';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
  { key: 'transactions', icon: <TableOutlined />, label: <Link to="/transactions">Transactions</Link> },
  { key: 'fraud', icon: <AlertOutlined />, label: <Link to="/fraud-alerts">Fraud Alerts</Link> },
  { key: 'audit', icon: <FileSearchOutlined />, label: <Link to="/audit-trail">Audit Trail</Link> },
  { key: 'settings', icon: <SettingOutlined />, label: <Link to="/settings">Settings</Link> },
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
      <Sider>
        <div style={{ color: '#fff', padding: 16, fontWeight: 'bold', fontSize: 18 }}>
          Tranzor Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'right', paddingRight: 24 }}>
          {/* Add user info, notifications, etc. here */}
        </Header>
        <Content style={{ margin: '24px 16px 0', background: '#fff', padding: 24 }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/fraud-alerts" element={<FraudAlertsPage />} />
            <Route path="/audit-trail" element={<AuditTrailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
