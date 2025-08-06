const mongoose = require('mongoose');

const istatistikSchema = new mongoose.Schema({
  // İstatistik türü
  tur: {
    type: String,
    required: [true, 'İstatistik türü zorunludur'],
    enum: ['kategori', 'durum', 'aylik', 'gunluk', 'oy', 'kullanici'],
    index: true
  },
  
  // Tarih aralığı
  tarih: {
    type: Date,
    required: [true, 'Tarih zorunludur'],
    index: true
  },
  
  // İstatistik verileri
  veriler: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Veriler zorunludur']
  },
  
  // Toplam sayılar
  toplamProje: {
    type: Number,
    default: 0
  },
  toplamFikir: {
    type: Number,
    default: 0
  },
  toplamOy: {
    type: Number,
    default: 0
  },
  toplamKullanici: {
    type: Number,
    default: 0
  },
  
  // Kategori bazlı istatistikler
  kategoriler: [{
    kategori: {
      type: String,
      enum: ['Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Ekonomi', 'Kültür', 'Diğer']
    },
    sayi: {
      type: Number,
      default: 0
    },
    ortalamaOy: {
      type: Number,
      default: 0
    }
  }],
  
  // Durum bazlı istatistikler
  durumlar: [{
    durum: {
      type: String,
      enum: ['Beklemede', 'Onaylandı', 'Reddedildi', 'Düzeltme Talebi', 'Aktif', 'Tamamlandı']
    },
    sayi: {
      type: Number,
      default: 0
    }
  }],
  
  // En popüler projeler
  populerProjeler: [{
    projeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proje'
    },
    baslik: String,
    ortalamaOy: Number,
    oySayisi: Number
  }],
  
  // Aktif
  aktif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index'ler
istatistikSchema.index({ tur: 1, tarih: -1 });
istatistikSchema.index({ aktif: 1, tur: 1 });

// İstatistik oluşturma/güncelleme metodu
istatistikSchema.statics.guncelleIstatistikler = async function() {
  const Proje = mongoose.model('Proje');
  const Oy = mongoose.model('Oy');
  
  try {
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    
    // Kategori istatistikleri
    const kategoriIstatistikleri = await Proje.aggregate([
      { $match: { aktif: true } },
      { $group: { _id: '$kategori', sayi: { $sum: 1 } } },
      { $sort: { sayi: -1 } }
    ]);
    
    // Durum istatistikleri
    const durumIstatistikleri = await Proje.aggregate([
      { $match: { aktif: true } },
      { $group: { _id: '$durum', sayi: { $sum: 1 } } },
      { $sort: { sayi: -1 } }
    ]);
    
    // En popüler projeler
    const populerProjeler = await Proje.find({ 
      aktif: true, 
      durum: 'Onaylandı' 
    })
    .sort({ ortalamaOy: -1, oySayisi: -1 })
    .limit(10)
    .select('baslik ortalamaOy oySayisi');
    
    // Toplam sayılar
    const toplamProje = await Proje.countDocuments({ aktif: true, tur: 'proje' });
    const toplamFikir = await Proje.countDocuments({ aktif: true, tur: 'fikir' });
    const toplamOy = await Oy.countDocuments({ aktif: true });
    
    // İstatistik verilerini hazırla
    const veriler = {
      kategoriIstatistikleri,
      durumIstatistikleri,
      populerProjeler: populerProjeler.map(p => ({
        projeId: p._id,
        baslik: p.baslik,
        ortalamaOy: p.ortalamaOy,
        oySayisi: p.oySayisi
      }))
    };
    
    // Kategorileri hazırla
    const kategoriler = kategoriIstatistikleri.map(k => ({
      kategori: k._id,
      sayi: k.sayi,
      ortalamaOy: 0 // Bu değer ayrıca hesaplanabilir
    }));
    
    // Durumları hazırla
    const durumlar = durumIstatistikleri.map(d => ({
      durum: d._id,
      sayi: d.sayi
    }));
    
    // İstatistik kaydını güncelle veya oluştur
    await this.findOneAndUpdate(
      { tur: 'genel', tarih: bugun },
      {
        tur: 'genel',
        tarih: bugun,
        veriler,
        toplamProje,
        toplamFikir,
        toplamOy,
        kategoriler,
        durumlar,
        populerProjeler: veriler.populerProjeler,
        aktif: true
      },
      { upsert: true, new: true }
    );
    
    console.log('İstatistikler güncellendi');
    
  } catch (error) {
    console.error('İstatistik güncelleme hatası:', error);
  }
};

module.exports = mongoose.model('Istatistik', istatistikSchema); 