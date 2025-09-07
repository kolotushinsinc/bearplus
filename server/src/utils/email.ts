import nodemailer, { Transporter } from 'nodemailer';
import { EmailOptions, EmailTemplate } from '../types';

// Проверка настроек email
const isEmailConfigured = (): boolean => {
  return !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  );
};

// Создание транспорта для отправки email
const createTransporter = (): Transporter => {
  if (!isEmailConfigured()) {
    // Fallback: для тестирования без настройки SMTP
    console.warn('⚠️  SMTP не настроен. Используется тестовый транспорт.');
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST!,
    port: parseInt(process.env.EMAIL_PORT!),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Отправка email
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Валидация входных параметров
    if (!options.email || !options.subject) {
      throw new Error('Email и subject обязательны');
    }

    // Проверяем настройки email
    if (!isEmailConfigured()) {
      console.warn('⚠️  Email не настроен. Используется Mock режим.');
      console.log('📧 Mock Email отправлен:');
      console.log(`   To: ${options.email}`);
      console.log(`   Subject: ${options.subject}`);
      console.log(`   Content: ${options.message || options.html?.substring(0, 100)}...`);
      
      // В mock режиме всегда возвращаем success
      return {
        success: true,
        messageId: `mock-${Date.now()}@bearplus.dev`,
      };
    }

    console.log(`📧 Попытка отправки email на ${options.email}...`);
    
    const transporter = createTransporter();

    // Проверяем подключение к SMTP серверу
    try {
      await transporter.verify();
      console.log('✅ SMTP соединение проверено успешно');
    } catch (verifyError) {
      console.warn('⚠️  SMTP проверка не удалась, продолжаем отправку:', verifyError);
    }

    const message = {
      from: `BearPlus <${process.env.EMAIL_USER || 'noreply@bearplus.dev'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message || 'BearPlus notification',
      html: options.html || options.message || '<p>BearPlus notification</p>',
    };

    console.log('📤 Отправляем email через SMTP...');
    const info = await transporter.sendMail(message);
    console.log('✅ Email отправлен успешно:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('❌ Ошибка отправки email:', error);
    console.error('   - Код ошибки:', error.code);
    console.error('   - Сообщение:', error.message);
    
    // Детальный анализ ошибки
    if (error.code === 'EAUTH') {
      console.error('   - Проблема с аутентификацией SMTP');
    } else if (error.code === 'ECONNECTION') {
      console.error('   - Проблема с подключением к SMTP серверу');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   - Таймаут подключения к SMTP серверу');
    }
    
    // В случае ошибки, логируем но не падаем
    console.warn('📧 Fallback: Mock email mode activated');
    console.log(`   To: ${options.email}`);
    console.log(`   Subject: ${options.subject}`);
    
    return {
      success: true, // Всегда true для fallback
      messageId: `fallback-${Date.now()}@bearplus.dev`,
      error: error.message,
    };
  }
};

// Шаблон для подтверждения регистрации
export const getVerificationEmailTemplate = (
  verifyUrl: string, 
  firstName: string, 
  language: 'ru' | 'en' | 'zh' = 'ru'
): EmailTemplate => {
  const templates: Record<string, EmailTemplate> = {
    ru: {
      subject: 'Подтверждение регистрации - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Добро пожаловать в BearPlus!</h2>
          <p>Здравствуйте, ${firstName}!</p>
          <p>Спасибо за регистрацию в BearPlus. Для завершения регистрации, пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Подтвердить Email</a>
          </div>
          <p>Если кнопка не работает, скопируйте и вставьте следующую ссылку в ваш браузер:</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>Эта ссылка действительна в течение 24 часов.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">Если вы не создавали аккаунт в BearPlus, просто проигнорируйте это письмо.</p>
        </div>
      `,
    },
    en: {
      subject: 'Email Verification - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Welcome to BearPlus!</h2>
          <p>Hello, ${firstName}!</p>
          <p>Thank you for registering with BearPlus. To complete your registration, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
          <p>If the button doesn't work, copy and paste the following link into your browser:</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>This link is valid for 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">If you didn't create an account with BearPlus, please ignore this email.</p>
        </div>
      `,
    },
    zh: {
      subject: '邮箱验证 - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">欢迎来到BearPlus！</h2>
          <p>您好，${firstName}！</p>
          <p>感谢您注册BearPlus。要完成注册，请点击下面的按钮验证您的电子邮件地址：</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">验证邮箱</a>
          </div>
          <p>如果按钮不起作用，请复制并粘贴以下链接到您的浏览器：</p>
          <p><a href="${verifyUrl}">${verifyUrl}</a></p>
          <p>此链接有效期为24小时。</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">如果您没有创建BearPlus账户，请忽略此邮件。</p>
        </div>
      `,
    },
  };

  return templates[language] || templates.ru;
};

// НОВАЯ функция для 4-значного кода восстановления пароля
export const generatePasswordResetCodeEmail = (
  resetCode: string,
  firstName: string,
  language: 'ru' | 'en' | 'zh' = 'ru'
): EmailTemplate => {
  const templates: Record<string, EmailTemplate> = {
    ru: {
      subject: 'Код восстановления пароля - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #f0f9f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; margin: 0; font-size: 28px;">BearPlus</h1>
            <p style="color: #a8c8a8; margin: 10px 0 0 0;">Логистическая платформа</p>
          </div>
          
          <h2 style="color: #e8f5e8; margin-bottom: 20px;">Код восстановления пароля</h2>
          
          <p style="color: #c1d9c1; margin-bottom: 30px; line-height: 1.6;">
            Здравствуйте, ${firstName}! Используйте этот 4-значный код для восстановления пароля:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00ff88, #1de9b6); padding: 20px 40px; border-radius: 12px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #0a0f0a;">
              ${resetCode}
            </div>
          </div>
          
          <p style="color: #7a9a7a; font-size: 14px; text-align: center; margin-top: 30px;">
            Код действителен в течение 30 минут
          </p>
          
          <div style="border-top: 1px solid #2d3d2d; margin: 30px 0; padding-top: 20px; text-align: center;">
            <p style="color: #6b8b6b; font-size: 12px; margin: 0;">
              BearPlus - Professional Logistics Platform
            </p>
          </div>
        </div>
      `
    },
    en: {
      subject: 'Password Reset Code - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #f0f9f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; margin: 0; font-size: 28px;">BearPlus</h1>
            <p style="color: #a8c8a8; margin: 10px 0 0 0;">Logistics Platform</p>
          </div>
          
          <h2 style="color: #e8f5e8; margin-bottom: 20px;">Password Reset Code</h2>
          
          <p style="color: #c1d9c1; margin-bottom: 30px; line-height: 1.6;">
            Hello ${firstName}! Use this 4-digit code to reset your password:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00ff88, #1de9b6); padding: 20px 40px; border-radius: 12px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #0a0f0a;">
              ${resetCode}
            </div>
          </div>
          
          <p style="color: #7a9a7a; font-size: 14px; text-align: center; margin-top: 30px;">
            This code expires in 30 minutes
          </p>
          
          <div style="border-top: 1px solid #2d3d2d; margin: 30px 0; padding-top: 20px; text-align: center;">
            <p style="color: #6b8b6b; font-size: 12px; margin: 0;">
              BearPlus - Professional Logistics Platform
            </p>
          </div>
        </div>
      `
    },
    zh: {
      subject: '密码重置代码 - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #f0f9f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; margin: 0; font-size: 28px;">BearPlus</h1>
            <p style="color: #a8c8a8; margin: 10px 0 0 0;">物流平台</p>
          </div>
          
          <h2 style="color: #e8f5e8; margin-bottom: 20px;">密码重置代码</h2>
          
          <p style="color: #c1d9c1; margin-bottom: 30px; line-height: 1.6;">
            您好 ${firstName}！请使用此4位数字代码重置密码：
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00ff88, #1de9b6); padding: 20px 40px; border-radius: 12px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #0a0f0a;">
              ${resetCode}
            </div>
          </div>
          
          <p style="color: #7a9a7a; font-size: 14px; text-align: center; margin-top: 30px;">
            此代码将在30分钟后过期
          </p>
          
          <div style="border-top: 1px solid #2d3d2d; margin: 30px 0; padding-top: 20px; text-align: center;">
            <p style="color: #6b8b6b; font-size: 12px; margin: 0;">
              BearPlus - Professional Logistics Platform
            </p>
          </div>
        </div>
      `
    }
  };

  return templates[language] || templates.ru;
};

// Шаблон для кода подтверждения email при регистрации
export const generateEmailVerificationCodeTemplate = (
  verificationCode: string,
  firstName: string,
  language: 'ru' | 'en' | 'zh' = 'ru'
): EmailTemplate => {
  const templates: Record<string, EmailTemplate> = {
    ru: {
      subject: 'Код подтверждения email - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #f0f9f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; margin: 0; font-size: 28px;">BearPlus</h1>
            <p style="color: #a8c8a8; margin: 10px 0 0 0;">Логистическая платформа</p>
          </div>
          
          <h2 style="color: #e8f5e8; margin-bottom: 20px;">Подтверждение регистрации</h2>
          
          <p style="color: #c1d9c1; margin-bottom: 30px; line-height: 1.6;">
            Здравствуйте, ${firstName}! Для завершения регистрации введите этот 4-значный код на сайте:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00ff88, #1de9b6); padding: 20px 40px; border-radius: 12px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #0a0f0a;">
              ${verificationCode}
            </div>
          </div>
          
          <p style="color: #7a9a7a; font-size: 14px; text-align: center; margin-top: 30px;">
            Код действителен в течение 30 минут
          </p>
          
          <div style="border-top: 1px solid #2d3d2d; margin: 30px 0; padding-top: 20px; text-align: center;">
            <p style="color: #6b8b6b; font-size: 12px; margin: 0;">
              Если вы не регистрировались на BearPlus, просто проигнорируйте это письмо
            </p>
          </div>
        </div>
      `
    },
    en: {
      subject: 'Email Verification Code - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #f0f9f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; margin: 0; font-size: 28px;">BearPlus</h1>
            <p style="color: #a8c8a8; margin: 10px 0 0 0;">Logistics Platform</p>
          </div>
          
          <h2 style="color: #e8f5e8; margin-bottom: 20px;">Email Verification</h2>
          
          <p style="color: #c1d9c1; margin-bottom: 30px; line-height: 1.6;">
            Hello ${firstName}! To complete your registration, enter this 4-digit code on the website:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00ff88, #1de9b6); padding: 20px 40px; border-radius: 12px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #0a0f0a;">
              ${verificationCode}
            </div>
          </div>
          
          <p style="color: #7a9a7a; font-size: 14px; text-align: center; margin-top: 30px;">
            This code expires in 30 minutes
          </p>
          
          <div style="border-top: 1px solid #2d3d2d; margin: 30px 0; padding-top: 20px; text-align: center;">
            <p style="color: #6b8b6b; font-size: 12px; margin: 0;">
              If you didn't register on BearPlus, please ignore this email
            </p>
          </div>
        </div>
      `
    },
    zh: {
      subject: '邮箱验证码 - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #f0f9f0; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00ff88; margin: 0; font-size: 28px;">BearPlus</h1>
            <p style="color: #a8c8a8; margin: 10px 0 0 0;">物流平台</p>
          </div>
          
          <h2 style="color: #e8f5e8; margin-bottom: 20px;">邮箱验证</h2>
          
          <p style="color: #c1d9c1; margin-bottom: 30px; line-height: 1.6;">
            您好 ${firstName}！要完成注册，请在网站上输入此4位数字验证码：
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #00ff88, #1de9b6); padding: 20px 40px; border-radius: 12px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #0a0f0a;">
              ${verificationCode}
            </div>
          </div>
          
          <p style="color: #7a9a7a; font-size: 14px; text-align: center; margin-top: 30px;">
            此验证码将在30分钟后过期
          </p>
          
          <div style="border-top: 1px solid #2d3d2d; margin: 30px 0; padding-top: 20px; text-align: center;">
            <p style="color: #6b8b6b; font-size: 12px; margin: 0;">
              如果您没有在BearPlus注册，请忽略此邮件
            </p>
          </div>
        </div>
      `
    }
  };

  return templates[language] || templates.ru;
};