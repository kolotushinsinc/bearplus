import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(path =>
    location.pathname.startsWith(path)
  );

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Левая часть - контакты */}
          <div className="flex items-center space-x-8">
            <a href="https://t.me/bearplus" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-bearplus-green rounded-lg flex items-center justify-center">
                <img src="/images/telegram_header.png" alt="Telegram" className="w-6 h-6" />
              </div>
            </a>
            <a href="mailto:info@bearplus.ru" className="flex items-center space-x-2 text-white hover:text-bearplus-green transition-colors">
              <img src="/images/email.png" alt="Email" className="w-5 h-5" />
              <span className="text-sm">info@bearplus.ru</span>
            </a>
            <a href="tel:+79302011993" className="flex items-center space-x-2 text-white hover:text-bearplus-green transition-colors">
              <img src="/images/phone.png" alt="Phone" className="w-5 h-5" />
              <span className="text-sm">+7 (930) 201-19-93</span>
            </a>
          </div>

          {/* Центр - логотип */}
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="Bearplus" className="h-10" />
          </Link>

          {/* Правая часть - язык и кнопки */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="bg-transparent border border-gray-500 text-white px-4 py-2 rounded text-sm font-medium flex items-center space-x-2 hover:bg-gray-800 transition-colors min-w-[80px] justify-center">
                <span>Rus</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M6 8L2 4H10L6 8Z"/>
                </svg>
              </button>
            </div>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded text-sm font-medium transition-colors min-w-[80px]"
                >
                  Кабинет
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors min-w-[80px]"
                >
                  Выйти
                </button>
                {user && (
                  <span className="text-white text-sm">
                    {user.firstName} {user.lastName}
                  </span>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded text-sm font-medium transition-colors min-w-[80px]"
                >
                  Вход
                </Link>
                <Link
                  to="/register"
                  className="btn-green text-sm min-w-[120px]"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 py-8 border-t border-gray-700/50 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Левая часть - контакты */}
            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-bearplus-green rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">@</span>
                </div>
                <span>@bearplus</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-bearplus-green rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">📞</span>
                </div>
                <span>info@bearplus.ru</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-bearplus-green rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">📞</span>
                </div>
                <span>+7 (930) 201-19-93</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-bearplus-green rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">📍</span>
                </div>
                <span>656011, г. Москва, ул. Октябрьская, 17</span>
              </div>
            </div>

            {/* Правая часть - логотип */}
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Bearplus" className="h-10" />
            </Link>
          </div>

          {/* Нижняя часть - кнопка и ссылки */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <button className="btn-green text-sm py-3 px-6 rounded-lg">
              Связаться с нами
            </button>
            
            <div className="flex space-x-6 text-xs text-gray-500">
              <Link to="/offer" className="hover:text-bearplus-green transition-colors">
                Публичная оферта
              </Link>
              <Link to="/privacy" className="hover:text-bearplus-green transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="hover:text-bearplus-green transition-colors">
                Условия использования сервиса
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;