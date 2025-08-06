const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

// JWT token oluşturma fonksiyonu
const generateToken = (adminId) => {
  return jwt.sign(
    { adminId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // 7 gün geçerli
  );
};

// Admin kayıt olma
const register = async (req, res) => {
  try {
    const { isim, soyisim, mail, sifre } = req.body;

    // E-posta kontrolü
    const existingAdmin = await Admin.findOne({ mail });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    // Yeni admin oluştur
    const admin = new Admin({
      isim,
      soyisim,
      mail,
      sifre
    });

    await admin.save();

    // Token oluştur
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin başarıyla oluşturuldu',
      data: {
        admin: admin.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Admin kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Admin kayıt işlemi başarısız',
      error: error.message
    });
  }
};

// Admin giriş yapma
const login = async (req, res) => {
  try {
    const { mail, sifre } = req.body;

    // Admin'i bul
    const admin = await Admin.findOne({ mail });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Şifre kontrolü
    const sifreGecerli = await admin.sifreKontrol(sifre);
    if (!sifreGecerli) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Hesap aktif mi kontrolü
    if (!admin.aktif) {
      return res.status(401).json({
        success: false,
        message: 'Hesabınız aktif değil'
      });
    }

    // Son giriş tarihini güncelle
    admin.sonGiris = new Date();
    await admin.save();

    // Token oluştur
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        admin: admin.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Admin giriş hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş işlemi başarısız',
      error: error.message
    });
  }
};

// Admin profilini getir
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil bilgileri alınamadı',
      error: error.message
    });
  }
};

// Admin profilini güncelle
const updateProfile = async (req, res) => {
  try {
    const { isim, soyisim, mail } = req.body;
    const adminId = req.admin._id;

    // E-posta değişikliği varsa kontrol et
    if (mail && mail !== req.admin.mail) {
      const existingAdmin = await Admin.findOne({ mail, _id: { $ne: adminId } });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Bu e-posta adresi zaten kullanılıyor'
        });
      }
    }

    // Profili güncelle
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { isim, soyisim, mail },
      { new: true, runValidators: true }
    ).select('-sifre');

    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      data: {
        admin: updatedAdmin
      }
    });
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenemedi',
      error: error.message
    });
  }
};

// Şifre değiştirme
const changePassword = async (req, res) => {
  try {
    const { mevcutSifre, yeniSifre } = req.body;
    const admin = await Admin.findById(req.admin._id);

    // Mevcut şifre kontrolü
    const sifreGecerli = await admin.sifreKontrol(mevcutSifre);
    if (!sifreGecerli) {
      return res.status(400).json({
        success: false,
        message: 'Mevcut şifre yanlış'
      });
    }

    // Yeni şifreyi güncelle
    admin.sifre = yeniSifre;
    await admin.save();

    res.json({
      success: true,
      message: 'Şifre başarıyla değiştirildi'
    });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre değiştirilemedi',
      error: error.message
    });
  }
};

// Çıkış yapma (client-side token silme)
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Çıkış başarılı'
    });
  } catch (error) {
    console.error('Çıkış hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Çıkış işlemi başarısız',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
}; 