const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Temel Bilgiler
  baslik: {
    type: String,
    required: [true, 'Başlık zorunludur'],
    trim: true,
    maxlength: [100, 'Başlık 100 karakterden uzun olamaz']
  },
  aciklama: {
    type: String,
    required: [true, 'Açıklama zorunludur'],
    trim: true,
    maxlength: [1000, 'Açıklama 1000 karakterden uzun olamaz']
  },
  
  // Tür ve Kategori
  tur: {
    type: String,
    required: [true, 'Tür zorunludur'],
    enum: ['fikir', 'proje'],
    default: 'fikir'
  },
  kategori: {
    type: String,
    required: [true, 'Kategori zorunludur'],
    enum: ['Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Ekonomi', 'Kültür', 'Diğer'],
    default: 'Diğer'
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
  
  // Olgunluk Seviyesi
  olgunlukSeviyesi: {
    type: String,
    enum: ['fikir', 'mvp', 'prototip', 'yayinda', 'gelistirme'],
    default: 'fikir'
  },
  
  // Kaynaklar ve Bütçe
  kaynaklar: {
    type: String,
    trim: true,
    maxlength: [500, 'Kaynaklar 500 karakterden uzun olamaz']
  },
  butce: {
    type: Number,
    min: [0, 'Bütçe negatif olamaz'],
    default: 0
  },
  
  // Tarihler
  baslangicTarihi: {
    type: Date
  },
  bitisTarihi: {
    type: Date
  },
  
  // Bağlantılar
  dosyaLink: {
    type: String,
    trim: true
  },
  
  // Başvuran Bilgileri
  olusturanKisi: {
    type: String,
    required: [true, 'Oluşturan kişi bilgisi zorunludur'],
    trim: true,
    maxlength: [100, 'İsim 100 karakterden uzun olamaz']
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
    trim: true
  },
  
  // Proje Detayları (sadece proje türü için)
  teknolojiler: {
    type: String,
    trim: true,
    maxlength: [300, 'Teknolojiler 300 karakterden uzun olamaz']
  },
  takimUyeleri: {
    type: String,
    trim: true,
    maxlength: [500, 'Takım üyeleri 500 karakterden uzun olamaz']
  },
  hedefler: {
    type: String,
    trim: true,
    maxlength: [500, 'Hedefler 500 karakterden uzun olamaz']
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for project duration
projectSchema.virtual('sure').get(function() {
  if (this.bitisTarihi && this.baslangicTarihi) {
    const diffTime = Math.abs(this.bitisTarihi - this.baslangicTarihi);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Index for better query performance
projectSchema.index({ kategori: 1, durum: 1 });
projectSchema.index({ baslik: 'text', aciklama: 'text' });
projectSchema.index({ aktif: 1, kategori: 1 }); // İstatistikler için optimize edilmiş index
projectSchema.index({ aktif: 1 }); // Aktif projeler için
projectSchema.index({ createdAt: -1 }); // Tarih sıralaması için

module.exports = mongoose.model('Project', projectSchema); 