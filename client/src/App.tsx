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
        await dispatch(getCurrentUser());
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setInitialCheckDone(true);
      }
    };

    // If user was previously authenticated, don't show loading screen
    if (isAuthenticated) {
      setInitialCheckDone(true);
      checkAuth(); // Still check in background
    } else {
      checkAuth();
    }
  }, [dispatch, isAuthenticated]);

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token?" element={<VerifyEmailPage />} />
      </Routes>
    </Layout>
  );
};

export default App;