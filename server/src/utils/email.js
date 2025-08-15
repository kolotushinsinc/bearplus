const nodemailer = require('nodemailer');

// Создание транспорта для отправки email
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Отправка email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const message = {
      from: `BearPlus <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Email could not be sent');
  }
};

// Шаблон для подтверждения регистрации
const getVerificationEmailTemplate = (verifyUrl, firstName, language = 'ru') => {
  const templates = {
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

// Шаблон для сброса пароля
const getPasswordResetEmailTemplate = (resetUrl, firstName, language = 'ru') => {
  const templates = {
    ru: {
      subject: 'Сброс пароля - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Сброс пароля</h2>
          <p>Здравствуйте, ${firstName}!</p>
          <p>Вы получили это письмо, потому что запросили сброс пароля для вашего аккаунта BearPlus.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Сбросить пароль</a>
          </div>
          <p>Если кнопка не работает, скопируйте и вставьте следующую ссылку в ваш браузер:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p><strong>Эта ссылка действительна в течение 10 минут.</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
        </div>
      `,
    },
    en: {
      subject: 'Password Reset - BearPlus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Password Reset</h2>
          <p>Hello, ${firstName}!</p>
          <p>You received this email because you requested a password reset for your BearPlus account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste the following link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p><strong>This link is valid for 10 minutes.</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
        </div>
      `,
    },
  };

  return templates[language] || templates.ru;
};

module.exports = {
  sendEmail,
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
};