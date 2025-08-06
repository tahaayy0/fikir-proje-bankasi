const mongoose = require('mongoose');

const oySchema = new mongoose.Schema({
  projeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Proje ID zorunludur']
  },
  kullaniciIP: {
    type: String,
    required: [true, 'Kullanıcı IP adresi zorunludur']
  },
  kullaniciEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi giriniz']
  },
  oy: {
    type: Number,
    required: [true, 'Oy değeri zorunludur'],
    min: [1, 'Oy en az 1 olmalıdır'],
    max: [5, 'Oy en fazla 5 olabilir']
  },
  yorum: {
    type: String,
    trim: true,
    maxlength: [500, 'Yorum 500 karakterden uzun olamaz']
  },
  kriterler: {
    toplulukFaydasi: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    problemCozumu: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    uygulanabilirlik: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    surdurulebilirlik: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    ilgiCekicilik: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },
  aktif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Aynı kullanıcının aynı projeye birden fazla oy vermesini engelle
oySchema.index({ projeId: 1, kullaniciIP: 1 }, { unique: true });
oySchema.index({ projeId: 1, kullaniciEmail: 1 }, { sparse: true });

// Oy verildikten sonra projenin ortalama oyunu güncelle
oySchema.post('save', async function(doc) {
  const Project = mongoose.model('Project');
  
  try {
    const proje = await Project.findById(doc.projeId);
    if (proje) {
      // Tüm aktif oyları al
      const oylar = await mongoose.model('Vote').find({
        projeId: doc.projeId,
        aktif: true
      });
      
      // Ortalama hesapla
      const toplamOy = oylar.reduce((sum, oy) => sum + oy.oy, 0);
      const ortalamaOy = oylar.length > 0 ? toplamOy / oylar.length : 0;
      
      // Projeyi güncelle
      await Project.findByIdAndUpdate(doc.projeId, {
        oySayisi: oylar.length,
        toplamOy: toplamOy,
        ortalamaOy: Math.round(ortalamaOy * 10) / 10 // 1 ondalık basamak
      });
    }
  } catch (error) {
    console.error('Oy güncelleme hatası:', error);
  }
});

module.exports = mongoose.model('Vote', oySchema); 