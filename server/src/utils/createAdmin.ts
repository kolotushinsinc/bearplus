import mongoose from 'mongoose';
import User from '../models/User';

const createAdmin = async () => {
  try {
    // Подключение к MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://root:Jdjdb2334328Hdbndhj@cluster0.y6mrt.mongodb.net/bearplusx?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI);
    
    console.log('📁 Подключение к MongoDB установлено');

    // Проверяем, есть ли уже админ
    const existingAdmin = await User.findOne({ userType: 'admin' });
    if (existingAdmin) {
      console.log('✅ Администратор уже существует:', existingAdmin.email);
      return;
    }

    // Создаем администратора
    const adminData = {
      userType: 'admin' as const,
      firstName: 'Администратор',
      lastName: 'CRM',
      username: 'admin',
      email: 'admin@bearplus.dev',
      phone: '+79999999999',
      password: 'admin123',
      companyName: 'BearPlus CRM',
      isEmailVerified: true,
      isActive: true,
      language: 'ru' as const
    };

    const admin = await User.create(adminData);
    console.log('✅ Администратор CRM создан успешно:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Пароль: admin123`);
    console.log(`   ID: ${admin._id}`);
    
  } catch (error) {
    console.error('❌ Ошибка создания администратора:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📁 Соединение с MongoDB закрыто');
  }
};

// Запуск скрипта
createAdmin();