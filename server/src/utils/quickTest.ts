import { getPasswordResetCodeTemplate } from './email';

console.log('🧪 ЭКСТРЕННЫЙ ТЕСТ ШАБЛОНА EMAIL:');
console.log('');

const testCode = '1234';
const testName = 'Тест Пользователь';

const template = getPasswordResetCodeTemplate(testCode, testName, 'ru');

console.log('📧 Subject:', template.subject);
console.log('');

// Ищем код в HTML
if (template.html.includes('1234')) {
  console.log('✅ КОД 1234 НАЙДЕН В ШАБЛОНЕ!');
} else {
  console.log('❌ КОД 1234 НЕ НАЙДЕН В ШАБЛОНЕ!');
}

// Ищем ссылки
const hasLinks = template.html.includes('href=') || template.html.includes('<a ');
if (hasLinks) {
  console.log('❌ В ШАБЛОНЕ НАЙДЕНЫ ССЫЛКИ (НЕ ДОЛЖНО БЫТЬ)');
} else {
  console.log('✅ ССЫЛКИ НЕ НАЙДЕНЫ - ПРАВИЛЬНО');
}

// Показываем часть HTML
console.log('');
console.log('📧 HTML содержимое (первые 300 символов):');
console.log(template.html.substring(0, 300) + '...');

console.log('');
console.log('🔍 Поиск кода в HTML:');
const codeIndex = template.html.indexOf('1234');
if (codeIndex !== -1) {
  const start = Math.max(0, codeIndex - 50);
  const end = Math.min(template.html.length, codeIndex + 50);
  console.log('Контекст вокруг кода:', template.html.substring(start, end));
}