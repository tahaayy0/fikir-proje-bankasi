const Admin = require('../models/Admin');
const mongoose = require('mongoose');

const adminData = {
  isim: 'Admin',
  soyisim: 'User',
  mail: 'admin@fikirprojebankasi.com',
  sifre: 'admin123456',
  aktif: true
};

const seedAdmin = async () => {
  try {
    // Mevcut admin'i kontrol et
    const existingAdmin = await Admin.findOne({ mail: adminData.mail });
    
    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut:', existingAdmin.mail);
      return existingAdmin;
    }

    // Yeni admin oluştur
    const admin = await Admin.create(adminData);
    console.log('Admin kullanıcısı başarıyla oluşturuldu:', admin.mail);
    console.log('Giriş bilgileri:');
    console.log('Email:', admin.mail);
    console.log('Şifre: admin123456');
    
    return admin;
  } catch (error) {
    console.error('Admin oluşturulurken hata:', error);
    throw error;
  }
};

// Eğer bu dosya doğrudan çalıştırılırsa
if (require.main === module) {
  require('dotenv').config();
  
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myappdb';
  
  const connectAndSeed = async () => {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB bağlantısı başarılı');
      await seedAdmin();
      console.log('Admin seed işlemi tamamlandı');
      process.exit(0);
    } catch (err) {
      console.error('Hata:', err);
      process.exit(1);
    }
  };
  
  connectAndSeed();
}

module.exports = { seedAdmin, adminData }; 