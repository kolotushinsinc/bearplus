const fetch = require('node-fetch');

async function testResendRoute() {
  try {
    console.log('🧪 Тестирование маршрута resend-verification...');
    
    const response = await fetch('https://api.bearplus.ru/api/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    const data = await response.json();
    
    console.log('📝 Status:', response.status);
    console.log('📝 Response:', data);
    
    if (response.status === 404 && data.message === 'Route not found') {
      console.log('❌ Маршрут не найден! Сервер не загрузил обновления.');
      console.log('✅ Решение: Перезапустите сервер полностью:');
      console.log('   1. Остановите сервер (Ctrl+C)');
      console.log('   2. cd server && npm run dev');
    } else {
      console.log('✅ Маршрут работает!');
    }
    
  } catch (error) {
    console.error('🔥 Ошибка подключения:', error.message);
    console.log('💡 Убедитесь что сервер запущен на порту 5005');
  }
}

testResendRoute();