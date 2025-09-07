const { execSync } = require('child_process');

console.log('🔍 Проверка TypeScript ошибок...');

try {
  // Проверяем TypeScript ошибки в сервере
  execSync('cd server && npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript проверка прошла успешно');
  
  console.log('\n📋 Для запуска сервера выполните:');
  console.log('cd server && npm run dev');
  
  console.log('\n🛠  Или для быстрого перезапуска:');
  console.log('1. Остановите сервер (Ctrl+C)');
  console.log('2. cd server && npm run dev');
  
  console.log('\n✅ API маршрут доступен по адресу:');
  console.log('POST https://api.bearplus.ru/api/api/auth/resend-verification');
  console.log('Body: {"email": "user@example.com"}');
  
} catch (error) {
  console.error('❌ Найдены ошибки TypeScript:', error.message);
  process.exit(1);
}