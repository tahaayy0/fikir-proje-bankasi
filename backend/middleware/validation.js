const { body } = require('express-validator');

const projeValidasyon = [
  body('baslik')
    .trim()
    .notEmpty()
    .withMessage('Proje başlığı zorunludur')
    .isLength({ max: 100 })
    .withMessage('Başlık 100 karakterden uzun olamaz'),
  
  body('aciklama')
    .trim()
    .notEmpty()
    .withMessage('Proje açıklaması zorunludur')
    .isLength({ max: 1000 })
    .withMessage('Açıklama 1000 karakterden uzun olamaz'),
  
  body('kategori')
    .optional()
    .isIn(['Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Diğer'])
    .withMessage('Geçersiz kategori'),
  
  body('durum')
    .optional()
    .isIn(['Taslak', 'Aktif', 'Tamamlandı', 'İptal'])
    .withMessage('Geçersiz durum'),
  
  body('oncelik')
    .optional()
    .isIn(['Düşük', 'Orta', 'Yüksek', 'Kritik'])
    .withMessage('Geçersiz öncelik'),
  
  body('baslangicTarihi')
    .optional()
    .isISO8601()
    .withMessage('Geçersiz başlangıç tarihi formatı'),
  
  body('bitisTarihi')
    .optional()
    .isISO8601()
    .withMessage('Geçersiz bitiş tarihi formatı'),
  
  body('butce')
    .optional()
    .isNumeric()
    .withMessage('Bütçe sayısal olmalıdır')
    .isFloat({ min: 0 })
    .withMessage('Bütçe negatif olamaz'),
  
  body('etiketler')
    .optional()
    .isArray()
    .withMessage('Etiketler dizi olmalıdır'),
  
  body('etiketler.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Her etiket 50 karakterden uzun olamaz'),
  
  body('olusturanKisi')
    .trim()
    .notEmpty()
    .withMessage('Oluşturan kişi bilgisi zorunludur')
    .isLength({ max: 100 })
    .withMessage('Oluşturan kişi adı 100 karakterden uzun olamaz')
];

module.exports = {
  projeValidasyon
}; 