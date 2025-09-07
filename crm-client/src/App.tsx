import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useAppSelector } from './hooks/redux';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import AgentsPage from './pages/AgentsPage';
import OrdersPage from './pages/OrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

const { Content } = Layout;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  
  // Показываем загрузку если состояние еще не определено
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
        <div>Проверка прав доступа...</div>
      </div>
    );
  }
  
  // Безопасная проверка аутентификации
  if (!isAuthenticated || !user || user.userType !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  const [initialCheckDone, setInitialCheckDone] = React.useState(false);

  // Инициализация приложения
  React.useEffect(() => {
    // Просто помечаем, что инициализация завершена
    setInitialCheckDone(true);
  }, []);

  // Показываем загрузку только при первой инициализации
  if (!initialCheckDone) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#001529'
      }}>
        <div style={{ color: '#fff', fontSize: '18px' }}>Инициализация...</div>
      </div>
    );
  }

  // Проверяем аутентификацию и роль
  const isAdmin = isAuthenticated && user && user.userType === 'admin';

  if (!isAdmin) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 280, background: 'transparent' }}>
        <Header />
        <Content style={{
          padding: '32px',
          background: 'transparent',
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto'
        }}>
          <div className="fade-in">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agents"
                element={
                  <ProtectedRoute>
                    <AgentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;