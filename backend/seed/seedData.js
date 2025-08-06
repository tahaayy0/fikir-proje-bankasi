const Proje = require('../models/Project');
const BasvuruTakip = require('../models/ApplicationTracking');
const { seedAdmin } = require('./adminSeed');
const mongoose = require('mongoose');

const ornekProjeler = [
  {
    baslik: 'Akıllı Şehir Uygulaması',
    aciklama: 'Trafik yoğunluğunu azaltmak ve şehir yaşamını iyileştirmek için IoT tabanlı akıllı şehir çözümü. Gerçek zamanlı veri toplama ve analiz ile trafik yönetimi optimizasyonu.',
    tur: 'fikir',
    kategori: 'Teknoloji',
    durum: 'Onaylandı',
    oncelik: 'Yüksek',
    problem: 'Şehirlerde trafik sıkışıklığı ve verimsiz trafik yönetimi',
    hedefKitle: 'Şehir sakinleri, belediyeler ve trafik yönetimi',
    olgunlukSeviyesi: 'mvp',
    kaynaklar: 'IoT sensörleri, yazılım geliştirme, veri analizi',
    butce: 500000,
    dosyaLink: 'https://example.com/akilli-sehir-demo',
    olusturanKisi: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    telefon: '+90 555 123 4567'
  },
  {
    baslik: 'Sürdürülebilir Enerji Projesi',
    aciklama: 'Güneş ve rüzgar enerjisi kullanarak yenilenebilir enerji üretimi. Karbon ayak izini azaltmak ve enerji bağımsızlığı sağlamak için kapsamlı bir proje.',
    tur: 'proje',
    kategori: 'Çevre',
    durum: 'Onaylandı',
    oncelik: 'Kritik',
    problem: 'Fosil yakıt bağımlılığı ve karbon emisyonları',
    hedefKisi: 'Enerji şirketleri, ev sahipleri ve çevre bilinci yüksek kişiler',
    olgunlukSeviyesi: 'yayinda',
    kaynaklar: 'Güneş panelleri, rüzgar türbinleri, enerji depolama sistemleri',
    butce: 1200000,
    baslangicTarihi: new Date('2024-03-01'),
    bitisTarihi: new Date('2025-06-30'),
    dosyaLink: 'https://example.com/enerji-projesi',
    olusturanKisi: 'Fatma Demir',
    email: 'fatma@example.com',
    telefon: '+90 555 234 5678',
    teknolojiler: 'Solar Panel, Wind Turbine, Battery Storage',
    takimUyeleri: 'Fatma Demir (Proje Yöneticisi), Mehmet Kaya (Teknik Uzman)',
    hedefler: 'Karbon emisyonlarını %50 azaltmak, enerji maliyetlerini düşürmek'
  },
  {
    baslik: 'Uzaktan Eğitim Platformu',
    aciklama: 'Pandemi sonrası dönemde eğitim sürekliliğini sağlamak için gelişmiş uzaktan eğitim platformu. Canlı ders, ödev takibi ve öğrenci performans analizi özellikleri.',
    tur: 'proje',
    kategori: 'Eğitim',
    durum: 'Tamamlandı',
    oncelik: 'Yüksek',
    problem: 'Pandemi döneminde eğitim sürekliliğinin sağlanamaması',
    hedefKisi: 'Öğrenciler, öğretmenler ve eğitim kurumları',
    olgunlukSeviyesi: 'yayinda',
    kaynaklar: 'Web geliştirme, video streaming, veritabanı',
    butce: 300000,
    baslangicTarihi: new Date('2023-09-01'),
    bitisTarihi: new Date('2024-02-28'),
    dosyaLink: 'https://example.com/uzaktan-egitim',
    olusturanKisi: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    telefon: '+90 555 456 7890',
    teknolojiler: 'React, Node.js, WebRTC, MongoDB',
    takimUyeleri: 'Mehmet Kaya (Geliştirici), Ayşe Demir (UI/UX)',
    hedefler: 'Eğitim sürekliliğini sağlamak, öğrenci performansını artırmak'
  },
  {
    baslik: 'Sağlık Takip Uygulaması',
    aciklama: 'Kronik hastalıkları olan hastaların sağlık durumlarını takip etmek için mobil uygulama. Doktor-hasta iletişimi ve sağlık verilerinin güvenli saklanması.',
    tur: 'fikir',
    kategori: 'Sağlık',
    durum: 'Beklemede',
    oncelik: 'Orta',
    problem: 'Kronik hastaların sağlık durumlarının düzenli takip edilememesi',
    hedefKisi: 'Kronik hastalar, doktorlar ve sağlık kurumları',
    olgunlukSeviyesi: 'fikir',
    kaynaklar: 'Mobil uygulama geliştirme, sağlık verisi yönetimi',
    butce: 250000,
    dosyaLink: 'https://example.com/saglik-takip',
    olusturanKisi: 'Dr. Ayşe Özkan',
    email: 'ayse@example.com',
    telefon: '+90 555 567 8901'
  },
  {
    baslik: 'Sosyal Yardım Ağı',
    aciklama: 'İhtiyaç sahiplerine yardım etmek için gönüllüler ve bağışçıları bir araya getiren sosyal platform. Şeffaf ve güvenilir yardım dağıtım sistemi.',
    tur: 'fikir',
    kategori: 'Sosyal',
    durum: 'Beklemede',
    oncelik: 'Düşük',
    problem: 'İhtiyaç sahiplerine yardım etmek isteyenlerin güvenilir bir platform bulamaması',
    hedefKisi: 'İhtiyaç sahipleri, gönüllüler ve bağışçılar',
    olgunlukSeviyesi: 'fikir',
    kaynaklar: 'Web platformu, güvenlik sistemi, şeffaflık araçları',
    butce: 80000,
    dosyaLink: 'https://example.com/sosyal-yardim',
    olusturanKisi: 'Zeynep Arslan',
    email: 'zeynep@example.com',
    telefon: '+90 555 678 9012'
  },
  {
    baslik: 'Yapay Zeka Destekli Çeviri',
    aciklama: 'Çok dilli çeviri hizmeti için yapay zeka tabanlı sistem. Makine öğrenmesi algoritmaları ile sürekli gelişen çeviri kalitesi.',
    tur: 'proje',
    kategori: 'Teknoloji',
    durum: 'Onaylandı',
    oncelik: 'Orta',
    problem: 'Dil bariyerleri ve kaliteli çeviri hizmetlerine erişim sorunu',
    hedefKisi: 'Uluslararası işletmeler, öğrenciler ve seyahat edenler',
    olgunlukSeviyesi: 'gelistirme',
    kaynaklar: 'Yapay zeka modelleri, dil veritabanları, API geliştirme',
    butce: 400000,
    baslangicTarihi: new Date('2024-01-01'),
    bitisTarihi: new Date('2024-10-31'),
    dosyaLink: 'https://example.com/ai-ceviri',
    olusturanKisi: 'Can Yıldız',
    email: 'can@example.com',
    telefon: '+90 555 789 0123',
    teknolojiler: 'Python, TensorFlow, NLP, API',
    takimUyeleri: 'Can Yıldız (AI Uzmanı), Deniz Kaya (Backend)',
    hedefler: 'Çeviri kalitesini artırmak, çoklu dil desteği sağlamak'
  },
  {
    baslik: 'Organik Tarım Kooperatifi',
    aciklama: 'Küçük çiftçileri desteklemek ve organik tarımı teşvik etmek için kooperatif modeli. Üretici-tüketici arasında doğrudan bağlantı.',
    tur: 'fikir',
    kategori: 'Çevre',
    durum: 'Beklemede',
    oncelik: 'Yüksek',
    problem: 'Küçük çiftçilerin pazarlama sorunları ve organik ürünlere erişim zorluğu',
    hedefKisi: 'Küçük çiftçiler, organik ürün tüketicileri',
    olgunlukSeviyesi: 'fikir',
    kaynaklar: 'Kooperatif yapısı, pazarlama platformu, lojistik',
    butce: 150000,
    dosyaLink: 'https://example.com/organik-tarim',
    olusturanKisi: 'Hasan Çelik',
    email: 'hasan@example.com',
    telefon: '+90 555 890 1234'
  },
  {
    baslik: 'Dijital Sanat Galerisi',
    aciklama: 'NFT ve dijital sanat eserlerini sergilemek için online galeri platformu. Sanatçıların eserlerini satabileceği güvenli marketplace.',
    tur: 'fikir',
    kategori: 'Diğer',
    durum: 'Beklemede',
    oncelik: 'Düşük',
    problem: 'Dijital sanatçıların eserlerini sergileyebileceği güvenli platform eksikliği',
    hedefKisi: 'Dijital sanatçılar, sanat koleksiyoncuları',
    olgunlukSeviyesi: 'fikir',
    kaynaklar: 'Blockchain teknolojisi, web platformu, güvenlik sistemi',
    butce: 120000,
    dosyaLink: 'https://example.com/dijital-sanat',
    olusturanKisi: 'Elif Yılmaz',
    email: 'elif@example.com',
    telefon: '+90 555 901 2345'
  }
];

const seedDatabase = async () => {
  try {
    // Admin'i seed et
    await seedAdmin();
    
    // Mevcut projeleri temizle
    await Proje.deleteMany({});
    console.log('Mevcut projeler temizlendi');

    // Yeni projeleri ekle
    const eklenenProjeler = await Proje.insertMany(ornekProjeler);
    console.log(`${eklenenProjeler.length} proje başarıyla eklendi`);

    // Başvuru takip kayıtları oluştur
    const basvuruTakipKayitlari = [];
    for (const proje of eklenenProjeler) {
      const basvuruTakip = new BasvuruTakip({
        projeId: proje._id,
        email: proje.email,
        durumGecmisi: [{
          durum: proje.durum,
          tarih: proje.createdAt,
          aciklama: 'Başvuru alındı',
          adminNotu: proje.durum === 'Onaylandı' ? 'Başvuru onaylandı' : 
                    proje.durum === 'Beklemede' ? 'Başvuru inceleniyor' : 'Başvuru reddedildi'
        }]
      });
      basvuruTakipKayitlari.push(basvuruTakip);
    }

    // Mevcut başvuru takip kayıtlarını temizle
    await BasvuruTakip.deleteMany({});
    
    // Yeni başvuru takip kayıtlarını ekle
    const eklenenBasvuruTakip = await BasvuruTakip.insertMany(basvuruTakipKayitlari);
    console.log(`${eklenenBasvuruTakip.length} başvuru takip kaydı oluşturuldu`);

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