import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { getCurrentUser } from './store/slices/authSlice';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import VerifyResetCodePage from './pages/auth/VerifyResetCodePage';
import FreightRatesPage from './pages/FreightRatesPage';
import ShipTrackingPage from './pages/ShipTrackingPage';
import ContainerRentalPage from './pages/ContainerRentalPage';
import AutoDeliveryPage from './pages/AutoDeliveryPage';
import RailwayTariffsPage from './pages/RailwayTariffsPage';
import MessengerPage from './pages/MessengerPage';

// ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [initialCheckDone, setInitialCheckDone] = React.useState(false);

  // Check authentication on app load
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем аутентификацию только если есть флаг в localStorage
        const authFlag = localStorage.getItem('isAuthenticated');
        if (authFlag === 'true') {
          await dispatch(getCurrentUser());
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // При ошибке очищаем состояние
        localStorage.removeItem('isAuthenticated');
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Show loading only if we haven't done initial check and user isn't authenticated
  if (!initialCheckDone && !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/verify-reset-code" element={<VerifyResetCodePage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/freight-rates" element={<FreightRatesPage />} />
        <Route path="/ship-tracking" element={<ShipTrackingPage />} />
        <Route path="/container-rental" element={<ContainerRentalPage />} />
        <Route path="/auto-delivery" element={<AutoDeliveryPage />} />
        <Route path="/railway-tariffs" element={<RailwayTariffsPage />} />
        <Route
          path="/messenger"
          element={
            <ProtectedRoute>
              <MessengerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;