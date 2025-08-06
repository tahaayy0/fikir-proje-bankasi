const mongoose = require('mongoose');

const basvuruTakipSchema = new mongoose.Schema({
  projeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proje',
    required: [true, 'Proje ID zorunludur']
  },
  email: {
    type: String,
    required: [true, 'E-posta zorunludur'],
    trim: true,
    lowercase: true
  },
  takipKodu: {
    type: String,
    required: [true, 'Takip kodu zorunludur'],
    unique: true,
    index: true
  },
  durumGecmisi: [{
    durum: {
      type: String,
      enum: ['Beklemede', 'Onaylandı', 'Reddedildi', 'Düzeltme Talebi', 'Aktif', 'Tamamlandı'],
      required: true
    },
    tarih: {
      type: Date,
      default: Date.now
    },
    aciklama: {
      type: String,
      trim: true,
      maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
    },
    adminNotu: {
      type: String,
      trim: true,
      maxlength: [1000, 'Admin notu 1000 karakterden uzun olamaz']
    }
  }],
  sonGuncelleme: {
    type: Date,
    default: Date.now
  },
  aktif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Takip kodu oluştur
basvuruTakipSchema.pre('save', function(next) {
  if (!this.takipKodu) {
    // 8 karakterlik benzersiz kod oluştur
    this.takipKodu = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

// Durum güncellendiğinde son güncelleme tarihini güncelle
basvuruTakipSchema.pre('save', function(next) {
  if (this.isModified('durumGecmisi')) {
    this.sonGuncelleme = new Date();
  }
  next();
});

// Index'ler
basvuruTakipSchema.index({ email: 1, aktif: 1 });
basvuruTakipSchema.index({ projeId: 1 });
basvuruTakipSchema.index({ sonGuncelleme: -1 });

module.exports = mongoose.model('BasvuruTakip', basvuruTakipSchema); 