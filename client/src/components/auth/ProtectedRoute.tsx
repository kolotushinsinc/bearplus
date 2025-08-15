import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { ProtectedRouteProps } from '../../types';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  allowedUserTypes,
}) => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Показываем загрузку пока проверяется аутентификация
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Если требуется аутентификация, но пользователь не авторизован
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если не требуется аутентификация, но пользователь авторизован
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Если требуется подтверждение email
  if (requireEmailVerification && user && !user.isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Подтверждение Email
            </h2>
            <p className="text-gray-600 mb-4">
              Для доступа к этой странице необходимо подтвердить ваш email адрес.
            </p>
            <p className="text-sm text-gray-500">
              Проверьте вашу почту и перейдите по ссылке подтверждения.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Если указаны разрешенные типы пользователей
  if (allowedUserTypes && user && !allowedUserTypes.includes(user.userType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Доступ запрещен
            </h2>
            <p className="text-gray-600 mb-4">
              У вас нет прав для доступа к этой странице.
            </p>
            <p className="text-sm text-gray-500">
              Требуемые права: {allowedUserTypes.join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Ваши права: {user.userType}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;