const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  ad: {
    type: String,
    required: [true, 'Ad zorunludur'],
    trim: true,
    maxlength: [100, 'Ad 100 karakterden uzun olamaz']
  },
  mail: {
    type: String,
    required: [true, 'E-posta zorunludur'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi giriniz']
  },
  rol: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  sifre: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  aktif: {
    type: Boolean,
    default: true
  },
  sonGiris: {
    type: Date
  }
}, {
  timestamps: true
});

// Şifreyi hash'leme middleware
adminSchema.pre('save', async function(next) {
  // Eğer şifre değişmemişse hash'leme
  if (!this.isModified('sifre')) return next();
  
  try {
    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(12);
    this.sifre = await bcrypt.hash(this.sifre, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
adminSchema.methods.sifreKontrol = async function(girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.sifre);
};

// JSON'dan şifreyi çıkar
adminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.sifre;
  return admin;
};

// Index'ler
adminSchema.index({ mail: 1 });
adminSchema.index({ aktif: 1 });

module.exports = mongoose.model('Admin', adminSchema); 