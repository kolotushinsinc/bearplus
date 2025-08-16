// Утилита для обработки ошибок и подавления нежелательных сообщений

export const suppressBinanceErrors = () => {
  // Подавляем ошибки от Binance Web3 расширения
  const originalConsoleError = console.error;
  
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Игнорируем ошибки от Binance расширения
    if (
      message.includes('binanceInjectedProvider') ||
      message.includes('chrome-extension://egjidjbpglichdcondbcbdnbeeppgdph') ||
      message.includes('Cannot read properties of null')
    ) {
      return;
    }
    
    // Логируем все остальные ошибки
    originalConsoleError.apply(console, args);
  };
};

// Глобальный обработчик ошибок
export const setupGlobalErrorHandler = () => {
  window.addEventListener('error', (event) => {
    // Игнорируем ошибки от расширений браузера
    if (
      event.filename?.includes('chrome-extension://') ||
      event.message?.includes('binanceInjectedProvider')
    ) {
      event.preventDefault();
      return;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    // Игнорируем отклоненные промисы от расширений
    if (
      event.reason?.message?.includes('binanceInjectedProvider') ||
      event.reason?.stack?.includes('chrome-extension://')
    ) {
      event.preventDefault();
      return;
    }
  });
};