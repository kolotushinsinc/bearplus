import { getPasswordResetCodeTemplate } from './email';

// Быстрый тест шаблона
const testCode = '1234';
const testName = 'Тест Пользователь';

console.log('🧪 Тест шаблона email с кодом восстановления:');
console.log('');

const template = getPasswordResetCodeTemplate(testCode, testName, 'ru');

console.log('📧 Subject:', template.subject);
console.log('');
console.log('📧 HTML содержимое:');
console.log(template.html);
console.log('');

// Проверяем, есть ли код в HTML
if (template.html.includes('1234')) {
  console.log('✅ Код 1234 найден в шаблоне!');
} else {
  console.log('❌ Код 1234 НЕ найден в шаблоне!');
}

// Проверяем, есть ли ссылки в HTML
if (template.html.includes('href=') || template.html.includes('<a ')) {
  console.log('⚠️  В шаблоне найдены ссылки (не должно быть для кода)');
} else {
  console.log('✅ Ссылки не найдены - правильно для шаблона с кодом');
}