const { body } = require('express-validator');

const projeValidasyon = [
  // Temel Bilgiler
  body('baslik')
    .trim()
    .notEmpty()
    .withMessage('Başlık zorunludur')
    .isLength({ max: 100 })
    .withMessage('Başlık 100 karakterden uzun olamaz'),
  
  // Açıklama alanları (fikir için kisaAciklama, proje için aciklama)
  body('aciklama')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Açıklama 1000 karakterden uzun olamaz'),
  
  body('kisaAciklama')
    .optional()
    .trim()
    .isLength({ max: 280 })
    .withMessage('Kısa açıklama 280 karakterden uzun olamaz'),
  
  // En az bir açıklama alanı zorunlu
  body()
    .custom((value, { req }) => {
      if (!value.aciklama && !value.kisaAciklama) {
        throw new Error('Açıklama veya kısa açıklama zorunludur');
      }
      return true;
    }),
  
  // Tür ve Kategori
  body('tur')
    .isIn(['fikir', 'proje'])
    .withMessage('Tür fikir veya proje olmalıdır'),
  
  body('kategori')
    .isIn(['Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Ekonomi', 'Kültür', 'Diğer'])
    .withMessage('Geçersiz kategori'),
  
  // Problem ve Hedef Kitle
  body('problem')
    .trim()
    .notEmpty()
    .withMessage('Problem açıklaması zorunludur')
    .isLength({ max: 500 })
    .withMessage('Problem açıklaması 500 karakterden uzun olamaz'),
  
  body('hedefKitle')
    .trim()
    .notEmpty()
    .withMessage('Hedef kitle zorunludur')
    .isLength({ max: 300 })
    .withMessage('Hedef kitle 300 karakterden uzun olamaz'),
  
  // Olgunluk Seviyesi
  body('olgunlukSeviyesi')
    .optional()
    .isIn(['fikir', 'mvp', 'prototip', 'yayinda', 'gelistirme'])
    .withMessage('Geçersiz olgunluk seviyesi'),
  
  // Kaynaklar ve Bütçe
  body('kaynaklar')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Kaynaklar 500 karakterden uzun olamaz'),
  
  body('butce')
    .optional()
    .isNumeric()
    .withMessage('Bütçe sayısal olmalıdır')
    .isFloat({ min: 0 })
    .withMessage('Bütçe negatif olamaz'),
  
  // Tarihler
  body('baslangicTarihi')
    .optional()
    .isISO8601()
    .withMessage('Geçersiz başlangıç tarihi formatı'),
  
  body('bitisTarihi')
    .optional()
    .isISO8601()
    .withMessage('Geçersiz bitiş tarihi formatı'),
  
  // Bağlantılar
  body('dosyaLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('Geçersiz dosya/link URL formatı'),
  
  // Başvuran Bilgileri
  body('olusturanKisi')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('İsim 100 karakterden uzun olamaz'),
  
  body('adSoyad')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Ad soyad 100 karakterden uzun olamaz'),
  
  // En az bir isim alanı zorunlu
  body()
    .custom((value, { req }) => {
      if (!value.olusturanKisi && !value.adSoyad) {
        throw new Error('Oluşturan kişi bilgisi zorunludur');
      }
      return true;
    }),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-posta zorunludur')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  
  body('telefon')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Telefon numarası 20 karakterden uzun olamaz'),
  
  // Proje Detayları (sadece proje türü için)
  body('teknolojiler')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Teknolojiler 300 karakterden uzun olamaz'),
  
  body('takimUyeleri')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Takım üyeleri 500 karakterden uzun olamaz'),
  
  body('hedefler')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Hedefler 500 karakterden uzun olamaz'),
  
  // Durum ve Öncelik
  body('durum')
    .optional()
    .isIn(['Beklemede', 'Onaylandı', 'Reddedildi', 'Düzeltme Talebi', 'Aktif', 'Tamamlandı'])
    .withMessage('Geçersiz durum'),
  
  body('oncelik')
    .optional()
    .isIn(['Düşük', 'Orta', 'Yüksek', 'Kritik'])
    .withMessage('Geçersiz öncelik')
];

const oyValidasyon = [
  body('oy')
    .isInt({ min: 1, max: 5 })
    .withMessage('Oy 1-5 arasında olmalıdır'),
  
  body('yorum')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Yorum 500 karakterden uzun olamaz'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  
  body('kriterler.toplulukFaydasi')
    .isInt({ min: 1, max: 5 })
    .withMessage('Topluluk faydası 1-5 arasında olmalıdır'),
  
  body('kriterler.problemCozumu')
    .isInt({ min: 1, max: 5 })
    .withMessage('Problem çözümü 1-5 arasında olmalıdır'),
  
  body('kriterler.uygulanabilirlik')
    .isInt({ min: 1, max: 5 })
    .withMessage('Uygulanabilirlik 1-5 arasında olmalıdır'),
  
  body('kriterler.surdurulebilirlik')
    .isInt({ min: 1, max: 5 })
    .withMessage('Sürdürülebilirlik 1-5 arasında olmalıdır'),
  
  body('kriterler.ilgiCekicilik')
    .isInt({ min: 1, max: 5 })
    .withMessage('İlgi çekicilik 1-5 arasında olmalıdır')
];

const fikirValidasyon = [
  // Temel Bilgiler
  body('baslik')
    .trim()
    .notEmpty()
    .withMessage('Fikir başlığı zorunludur')
    .isLength({ max: 100 })
    .withMessage('Başlık 100 karakterden uzun olamaz'),
  
  body('kisaAciklama')
    .trim()
    .notEmpty()
    .withMessage('Kısa açıklama zorunludur')
    .isLength({ max: 280 })
    .withMessage('Kısa açıklama 280 karakterden uzun olamaz'),
  
  // Problem ve Hedef Kitle
  body('problem')
    .trim()
    .notEmpty()
    .withMessage('Problem açıklaması zorunludur')
    .isLength({ max: 500 })
    .withMessage('Problem açıklaması 500 karakterden uzun olamaz'),
  
  body('hedefKitle')
    .trim()
    .notEmpty()
    .withMessage('Hedef kitle zorunludur')
    .isLength({ max: 300 })
    .withMessage('Hedef kitle 300 karakterden uzun olamaz'),
  
  // Kategori ve Olgunluk
  body('kategori')
    .isIn(['Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Ekonomi', 'Kültür', 'Diğer'])
    .withMessage('Geçersiz kategori'),
  
  body('olgunlukSeviyesi')
    .optional()
    .isIn(['fikir', 'mvp', 'yayinda'])
    .withMessage('Geçersiz olgunluk seviyesi'),
  
  // Kaynaklar ve Destekleyici Materyaller
  body('kaynaklar')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Kaynaklar 500 karakterden uzun olamaz'),
  
  body('dosyaLink')
    .optional()
    .trim()
    .isURL()
    .withMessage('Geçersiz dosya/link URL formatı'),
  
  // Başvuran Bilgileri
  body('adSoyad')
    .trim()
    .notEmpty()
    .withMessage('Ad soyad zorunludur')
    .isLength({ max: 100 })
    .withMessage('Ad soyad 100 karakterden uzun olamaz'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-posta zorunludur')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  
  body('telefon')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Telefon numarası 20 karakterden uzun olamaz')
];

module.exports = {
  projeValidasyon,
  oyValidasyon,
  fikirValidasyon
}; 