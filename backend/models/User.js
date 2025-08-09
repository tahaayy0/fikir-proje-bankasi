const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ad zorunludur'],
    trim: true,
    maxlength: [100, 'Ad 100 karakterden uzun olamaz']
  },
  email: {
    type: String,
    required: [true, 'E-posta zorunludur'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir e-posta adresi giriniz']
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  role: {
    type: String,
    enum: ['user', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Biyografi 500 karakterden uzun olamaz']
    },
    phone: String,
    location: String
  }
}, {
  timestamps: true
});

// Şifreyi hash'leme middleware
userSchema.pre('save', async function(next) {
  // Eğer şifre değişmemişse hash'leme
  if (!this.isModified('password')) return next();
  
  try {
    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// JSON'dan şifreyi çıkar
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Index'ler
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
