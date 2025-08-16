import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import './index.css';
import App from './App';
import { store } from './store';
import { suppressBinanceErrors, setupGlobalErrorHandler } from './utils/errorHandler';

// Настраиваем обработку ошибок перед инициализацией приложения
suppressBinanceErrors();
setupGlobalErrorHandler();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider 
          locale={ruRU}
          theme={{
            token: {
              colorPrimary: '#52c41a',
              colorBgContainer: '#001529',
              colorText: '#ffffff',
              colorTextSecondary: '#8c8c8c'
            }
          }}
        >
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);