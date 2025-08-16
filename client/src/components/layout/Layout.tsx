import * as React from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

interface FeedbackFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormData>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleFeedbackInputChange = (field: keyof FeedbackFormData, value: string) => {
    setFeedbackForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call to submit feedback
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackForm)
      });

      if (response.ok) {
        alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
        setShowFeedbackModal(false);
        setFeedbackForm({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        alert('Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedbackForm({
      name: '',
      phone: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-6 border-b border-gray-700/50">
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
            <div className="flex items-center space-x-8 text-sm text-white">
              <div className="flex items-center space-x-2">
                <img src="/images/telegram_footer.png" alt="Telegram" className="w-5 h-5" />
                <span>@bearplus</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src="/images/email.png" alt="Email" className="w-5 h-5" />
                <span>info@bearplus.ru</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src="/images/phone.png" alt="Phone" className="w-5 h-5" />
                <span>+7 (930) 201-19-93</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src="/images/location_footer.png" alt="Location" className="w-5 h-5" />
                <span>656011, г. Москва, ул. Октябрьская, 17</span>
              </div>
            </div>

            {/* Правая часть - логотип */}
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Bearplus" className="h-10" />
            </Link>
          </div>

          {/* Нижняя часть - кнопка и ссылки */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="bg-bearplus-green hover:bg-green-500 text-black text-sm py-3 px-6 rounded font-medium transition-colors"
            >
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

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeFeedbackModal}>
          <div className="bg-bearplus-card-dark rounded-xl p-6 w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Обратная связь</h3>
              <button
                onClick={closeFeedbackModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  value={feedbackForm.name}
                  onChange={(e) => handleFeedbackInputChange('name', e.target.value)}
                  placeholder="Введите ваше имя"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  value={feedbackForm.phone}
                  onChange={(e) => handleFeedbackInputChange('phone', e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={feedbackForm.email}
                  onChange={(e) => handleFeedbackInputChange('email', e.target.value)}
                  placeholder="example@company.com"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Текст обращения *
                </label>
                <textarea
                  value={feedbackForm.message}
                  onChange={(e) => handleFeedbackInputChange('message', e.target.value)}
                  placeholder="Опишите ваш запрос или вопрос..."
                  className="input-field w-full h-32 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить'}
                </button>
                <button
                  type="button"
                  onClick={closeFeedbackModal}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Нажимая "Отправить", вы соглашаетесь с обработкой персональных данных
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;