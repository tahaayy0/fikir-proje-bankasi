const { seedDatabase } = require('./seed/seedData');
const mongoose = require('mongoose');
const path = require('path');

// Ana dizindeki .env dosyasını kullan
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const seedAtlas = async () => {
  try {
    // MongoDB Atlas bağlantısı
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error('MONGO_URI environment variable bulunamadı!');
      console.log('Lütfen .env dosyasında MONGO_URI değişkenini ayarlayın.');
      process.exit(1);
    }
    
    console.log('MongoDB Atlas bağlantısı kuruluyor...');
    console.log('Using URI:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Şifreyi gizle
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      ssl: true,
      sslValidate: false,
      retryReads: true
    });
    
    console.log('MongoDB Atlas bağlantısı başarılı');
    console.log('Database:', mongoose.connection.name);
    
    // Seed data'yı çalıştır
    await seedDatabase();
    
    console.log('Seed işlemi tamamlandı!');
    console.log('Artık hem Docker hem de Render aynı veritabanını kullanıyor.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('Seed işlemi sırasında hata:', error);
    process.exit(1);
  }
};

seedAtlas(); 