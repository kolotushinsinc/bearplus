import { sendEmail, getPasswordResetCodeTemplate } from './email';

// Тестовая функция для проверки отправки email
export const testEmailSending = async (): Promise<void> => {
  console.log('🧪 Начинаем тестирование модуля email...\n');

  // Тест 1: Отправка тестового email
  console.log('📧 Тест 1: Отправка простого email');
  const testResult1 = await sendEmail({
    email: 'test@example.com',
    subject: 'Тест модуля email - BearPlus',
    html: '<h2>Тестовое письмо</h2><p>Модуль email работает корректно!</p>'
  });
  
  console.log('Результат теста 1:', testResult1);
  console.log('');

  // Тест 2: Отправка кода восстановления пароля
  console.log('📧 Тест 2: Отправка кода восстановления пароля');
  const resetCode = '1234';
  const template = getPasswordResetCodeTemplate(resetCode, 'Тестовый Пользователь', 'ru');
  
  const testResult2 = await sendEmail({
    email: 'user@example.com',
    subject: template.subject,
    html: template.html
  });
  
  console.log('Результат теста 2:', testResult2);
  console.log('');

  // Тест 3: Отправка на английском языке
  console.log('📧 Тест 3: Отправка кода на английском языке');
  const templateEn = getPasswordResetCodeTemplate('5678', 'Test User', 'en');
  
  const testResult3 = await sendEmail({
    email: 'english@example.com',
    subject: templateEn.subject,
    html: templateEn.html
  });
  
  console.log('Результат теста 3:', testResult3);
  console.log('');

  // Тест 4: Отправка на китайском языке
  console.log('📧 Тест 4: Отправка кода на китайском языке');
  const templateZh = getPasswordResetCodeTemplate('9999', '测试用户', 'zh');
  
  const testResult4 = await sendEmail({
    email: 'chinese@example.com',
    subject: templateZh.subject,
    html: templateZh.html
  });
  
  console.log('Результат теста 4:', testResult4);
  console.log('');

  // Тест 5: Обработка ошибки валидации
  console.log('📧 Тест 5: Проверка валидации (должна быть ошибка)');
  try {
    const testResult5 = await sendEmail({
      email: '',
      subject: '',
      html: ''
    });
    console.log('Результат теста 5:', testResult5);
  } catch (error) {
    console.log('Ошибка валидации (ожидаемо):', error);
  }

  console.log('✅ Тестирование модуля email завершено!');
};

// Быстрый тест функции
if (require.main === module) {
  testEmailSending().catch(console.error);
}