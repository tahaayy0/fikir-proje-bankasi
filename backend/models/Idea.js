const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  // Temel Bilgiler
  baslik: {
    type: String,
    required: [true, 'Fikir başlığı zorunludur'],
    trim: true,
    maxlength: [100, 'Başlık 100 karakterden uzun olamaz']
  },
  kisaAciklama: {
    type: String,
    required: [true, 'Kısa açıklama zorunludur'],
    trim: true,
    maxlength: [280, 'Kısa açıklama 280 karakterden uzun olamaz']
  },
  
  // Problem ve Hedef Kitle
  problem: {
    type: String,
    required: [true, 'Problem açıklaması zorunludur'],
    trim: true,
    maxlength: [500, 'Problem açıklaması 500 karakterden uzun olamaz']
  },
  hedefKitle: {
    type: String,
    required: [true, 'Hedef kitle zorunludur'],
    trim: true,
    maxlength: [300, 'Hedef kitle 300 karakterden uzun olamaz']
  },
  
  // Kategori ve Olgunluk
  kategori: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: ['Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Ekonomi', 'Kültür', 'Diğer'],
    default: 'Diğer'
  },
  olgunlukSeviyesi: {
    type: String,
    required: [true, 'Olgunluk seviyesi zorunludur'],
    enum: ['fikir', 'mvp', 'yayinda'],
    default: 'fikir'
  },
  
  // Kaynaklar ve Destekleyici Materyaller
  kaynaklar: {
    type: String,
    trim: true,
    maxlength: [500, 'Kaynaklar 500 karakterden uzun olamaz']
  },
  dosyaLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Boş olabilir
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Geçerli bir URL giriniz'
    }
  },
  
  // Başvuran Bilgileri
  adSoyad: {
    type: String,
    required: [true, 'Ad soyad zorunludur'],
    trim: true,
    maxlength: [100, 'Ad soyad 100 karakterden uzun olamaz']
  },
  email: {
    type: String,
    required: [true, 'E-posta zorunludur'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi giriniz']
  },
  telefon: {
    type: String,
    trim: true,
    maxlength: [20, 'Telefon numarası 20 karakterden uzun olamaz']
  },
  
  // Durum ve Onay
  durum: {
    type: String,
    enum: ['Beklemede', 'Onaylandı', 'Reddedildi', 'Düzeltme Talebi', 'Aktif', 'Tamamlandı'],
    default: 'Beklemede'
  },
  oncelik: {
    type: String,
    enum: ['Düşük', 'Orta', 'Yüksek', 'Kritik'],
    default: 'Orta'
  },
  
  // Oylama Sistemi
  oySayisi: {
    type: Number,
    default: 0,
    min: 0
  },
  toplamOy: {
    type: Number,
    default: 0,
    min: 0
  },
  ortalamaOy: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Durum
  aktif: {
    type: Boolean,
    default: true
  },
  
  // Admin Notları
  adminNotlari: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notları 1000 karakterden uzun olamaz']
  },
  
  // Red Nedeni (eğer reddedilirse)
  redNedeni: {
    type: String,
    trim: true,
    maxlength: [500, 'Red nedeni 500 karakterden uzun olamaz']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for idea age
ideaSchema.virtual('yas').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Indexes for better query performance
ideaSchema.index({ kategori: 1, durum: 1 });
ideaSchema.index({ baslik: 'text', kisaAciklama: 'text', problem: 'text' });
ideaSchema.index({ aktif: 1, kategori: 1 });
ideaSchema.index({ aktif: 1 });
ideaSchema.index({ createdAt: -1 });
ideaSchema.index({ email: 1 }); // Kullanıcının fikirlerini bulmak için

module.exports = mongoose.model('Idea', ideaSchema); 