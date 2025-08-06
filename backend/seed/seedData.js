const Proje = require('../models/Proje');
const mongoose = require('mongoose');

const ornekProjeler = [
  {
    baslik: 'Akıllı Şehir Uygulaması',
    aciklama: 'Trafik yoğunluğunu azaltmak ve şehir yaşamını iyileştirmek için IoT tabanlı akıllı şehir çözümü. Gerçek zamanlı veri toplama ve analiz ile trafik yönetimi optimizasyonu.',
    kategori: 'Teknoloji',
    durum: 'Aktif',
    oncelik: 'Yüksek',
    baslangicTarihi: new Date('2024-01-15'),
    bitisTarihi: new Date('2024-12-31'),
    butce: 500000,
    etiketler: ['IoT', 'Akıllı Şehir', 'Trafik', 'Optimizasyon'],
    olusturanKisi: 'Ahmet Yılmaz'
  },
  {
    baslik: 'Sürdürülebilir Enerji Projesi',
    aciklama: 'Güneş ve rüzgar enerjisi kullanarak yenilenebilir enerji üretimi. Karbon ayak izini azaltmak ve enerji bağımsızlığı sağlamak için kapsamlı bir proje.',
    kategori: 'Çevre',
    durum: 'Aktif',
    oncelik: 'Kritik',
    baslangicTarihi: new Date('2024-03-01'),
    bitisTarihi: new Date('2025-06-30'),
    butce: 1200000,
    etiketler: ['Yenilenebilir Enerji', 'Güneş', 'Rüzgar', 'Sürdürülebilirlik'],
    olusturanKisi: 'Fatma Demir'
  },
  {
    baslik: 'Uzaktan Eğitim Platformu',
    aciklama: 'Pandemi sonrası dönemde eğitim sürekliliğini sağlamak için gelişmiş uzaktan eğitim platformu. Canlı ders, ödev takibi ve öğrenci performans analizi özellikleri.',
    kategori: 'Eğitim',
    durum: 'Tamamlandı',
    oncelik: 'Yüksek',
    baslangicTarihi: new Date('2023-09-01'),
    bitisTarihi: new Date('2024-02-28'),
    butce: 300000,
    etiketler: ['Eğitim', 'Uzaktan Öğrenme', 'Platform', 'Teknoloji'],
    olusturanKisi: 'Mehmet Kaya'
  },
  {
    baslik: 'Sağlık Takip Uygulaması',
    aciklama: 'Kronik hastalıkları olan hastaların sağlık durumlarını takip etmek için mobil uygulama. Doktor-hasta iletişimi ve sağlık verilerinin güvenli saklanması.',
    kategori: 'Sağlık',
    durum: 'Aktif',
    oncelik: 'Orta',
    baslangicTarihi: new Date('2024-02-01'),
    bitisTarihi: new Date('2024-11-30'),
    butce: 250000,
    etiketler: ['Sağlık', 'Mobil Uygulama', 'Takip', 'Kronik Hastalık'],
    olusturanKisi: 'Dr. Ayşe Özkan'
  },
  {
    baslik: 'Sosyal Yardım Ağı',
    aciklama: 'İhtiyaç sahiplerine yardım etmek için gönüllüler ve bağışçıları bir araya getiren sosyal platform. Şeffaf ve güvenilir yardım dağıtım sistemi.',
    kategori: 'Sosyal',
    durum: 'Taslak',
    oncelik: 'Düşük',
    baslangicTarihi: new Date('2024-05-01'),
    bitisTarihi: new Date('2024-12-31'),
    butce: 80000,
    etiketler: ['Sosyal Yardım', 'Gönüllülük', 'Bağış', 'Toplum'],
    olusturanKisi: 'Zeynep Arslan'
  },
  {
    baslik: 'Yapay Zeka Destekli Çeviri',
    aciklama: 'Çok dilli çeviri hizmeti için yapay zeka tabanlı sistem. Makine öğrenmesi algoritmaları ile sürekli gelişen çeviri kalitesi.',
    kategori: 'Teknoloji',
    durum: 'Aktif',
    oncelik: 'Orta',
    baslangicTarihi: new Date('2024-01-01'),
    bitisTarihi: new Date('2024-10-31'),
    butce: 400000,
    etiketler: ['Yapay Zeka', 'Çeviri', 'Makine Öğrenmesi', 'Dil'],
    olusturanKisi: 'Can Yıldız'
  },
  {
    baslik: 'Organik Tarım Kooperatifi',
    aciklama: 'Küçük çiftçileri desteklemek ve organik tarımı teşvik etmek için kooperatif modeli. Üretici-tüketici arasında doğrudan bağlantı.',
    kategori: 'Çevre',
    durum: 'Aktif',
    oncelik: 'Yüksek',
    baslangicTarihi: new Date('2024-04-01'),
    bitisTarihi: new Date('2025-03-31'),
    butce: 150000,
    etiketler: ['Organik Tarım', 'Kooperatif', 'Sürdürülebilirlik', 'Çiftçi'],
    olusturanKisi: 'Hasan Çelik'
  },
  {
    baslik: 'Dijital Sanat Galerisi',
    aciklama: 'NFT ve dijital sanat eserlerini sergilemek için online galeri platformu. Sanatçıların eserlerini satabileceği güvenli marketplace.',
    kategori: 'Diğer',
    durum: 'Taslak',
    oncelik: 'Düşük',
    baslangicTarihi: new Date('2024-06-01'),
    bitisTarihi: new Date('2024-12-31'),
    butce: 120000,
    etiketler: ['NFT', 'Dijital Sanat', 'Galeri', 'Marketplace'],
    olusturanKisi: 'Elif Yılmaz'
  }
];

const seedDatabase = async () => {
  try {
    // Mevcut projeleri temizle
    await Proje.deleteMany({});
    console.log('Mevcut projeler temizlendi');

    // Yeni projeleri ekle
    const eklenenProjeler = await Proje.insertMany(ornekProjeler);
    console.log(`${eklenenProjeler.length} proje başarıyla eklendi`);

    return eklenenProjeler;
  } catch (error) {
    console.error('Seed işlemi sırasında hata:', error);
    throw error;
  }
};

// Eğer bu dosya doğrudan çalıştırılırsa
if (require.main === module) {
  // MongoDB bağlantısı
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/myappdb';
  
  const connectAndSeed = async () => {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB bağlantısı başarılı');
      await seedDatabase();
      console.log('Seed işlemi tamamlandı');
      process.exit(0);
    } catch (err) {
      console.error('MongoDB bağlantı hatası:', err);
      // Retry connection after 5 seconds
      setTimeout(connectAndSeed, 5000);
    }
  };
  
  connectAndSeed();
}

module.exports = { seedDatabase, ornekProjeler }; 