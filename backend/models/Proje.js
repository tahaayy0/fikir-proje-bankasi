const mongoose = require('mongoose');

const projeSchema = new mongoose.Schema({
  baslik: {
    type: String,
    required: [true, 'Proje başlığı zorunludur'],
    trim: true,
    maxlength: [100, 'Başlık 100 karakterden uzun olamaz']
  },
  aciklama: {
    type: String,
    required: [true, 'Proje açıklaması zorunludur'],
    trim: true,
    maxlength: [1000, 'Açıklama 1000 karakterden uzun olamaz']
  },
  kategori: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: ['Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Diğer'],
    default: 'Diğer'
  },
  durum: {
    type: String,
    enum: ['Taslak', 'Aktif', 'Tamamlandı', 'İptal'],
    default: 'Taslak'
  },
  oncelik: {
    type: String,
    enum: ['Düşük', 'Orta', 'Yüksek', 'Kritik'],
    default: 'Orta'
  },
  baslangicTarihi: {
    type: Date,
    default: Date.now
  },
  bitisTarihi: {
    type: Date
  },
  butce: {
    type: Number,
    min: [0, 'Bütçe negatif olamaz']
  },
  etiketler: [{
    type: String,
    trim: true
  }],
  olusturanKisi: {
    type: String,
    required: [true, 'Oluşturan kişi bilgisi zorunludur'],
    trim: true
  },
  aktif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for project duration
projeSchema.virtual('sure').get(function() {
  if (this.bitisTarihi && this.baslangicTarihi) {
    const diffTime = Math.abs(this.bitisTarihi - this.baslangicTarihi);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Index for better query performance
projeSchema.index({ kategori: 1, durum: 1 });
projeSchema.index({ baslik: 'text', aciklama: 'text' });
projeSchema.index({ aktif: 1, kategori: 1 }); // İstatistikler için optimize edilmiş index
projeSchema.index({ aktif: 1 }); // Aktif projeler için
projeSchema.index({ createdAt: -1 }); // Tarih sıralaması için

module.exports = mongoose.model('Proje', projeSchema); 