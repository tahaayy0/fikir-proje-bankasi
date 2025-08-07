const Admin = require('../models/Admin');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Admin girişi
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { mail, sifre } = req.body;

    // Admin'i bul
    const admin = await Admin.findOne({ mail });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(sifre, admin.sifre);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { id: admin._id, mail: admin.mail },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      admin: {
        id: admin._id,
        ad: admin.ad,
        mail: admin.mail,
        rol: admin.rol
      }
    });

  } catch (error) {
    console.error('Admin girişi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş yapılırken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Admin kaydı
// @route   POST /api/admin/register
// @access  Public
const adminRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { ad, mail, sifre } = req.body;

    // E-posta zaten kullanılıyor mu kontrol et
    const existingAdmin = await Admin.findOne({ mail });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sifre, salt);

    // Admin oluştur
    const admin = await Admin.create({
      ad,
      mail,
      sifre: hashedPassword,
      rol: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin başarıyla oluşturuldu',
      admin: {
        id: admin._id,
        ad: admin.ad,
        mail: admin.mail,
        rol: admin.rol
      }
    });

  } catch (error) {
    console.error('Admin kaydı hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt yapılırken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Admin çıkışı
// @route   POST /api/admin/logout
// @access  Private
const adminLogout = async (req, res) => {
  try {
    // JWT token'ı geçersiz kıl (client-side'da yapılır)
    res.json({
      success: true,
      message: 'Çıkış başarılı'
    });
  } catch (error) {
    console.error('Admin çıkışı hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Çıkış yapılırken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Admin profili getir
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-sifre');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin bulunamadı'
      });
    }

    res.json({
      success: true,
      admin
    });

  } catch (error) {
    console.error('Admin profili getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Admin profili güncelle
// @route   PUT /api/admin/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { ad, mail } = req.body;

    // E-posta zaten kullanılıyor mu kontrol et (kendi e-postası hariç)
    const existingAdmin = await Admin.findOne({ 
      mail, 
      _id: { $ne: req.admin.id } 
    });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { ad, mail },
      { new: true, runValidators: true }
    ).select('-sifre');

    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      admin
    });

  } catch (error) {
    console.error('Admin profili güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Admin şifre değiştir
// @route   PUT /api/admin/change-password
// @access  Private
const changeAdminPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { mevcutSifre, yeniSifre } = req.body;

    // Admin'i bul
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin bulunamadı'
      });
    }

    // Mevcut şifreyi kontrol et
    const isMatch = await bcrypt.compare(mevcutSifre, admin.sifre);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mevcut şifre yanlış'
      });
    }

    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(yeniSifre, salt);

    // Şifreyi güncelle
    admin.sifre = hashedPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Şifre başarıyla değiştirildi'
    });

  } catch (error) {
    console.error('Admin şifre değiştirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre değiştirilirken bir hata oluştu',
      error: error.message
    });
  }
};

module.exports = {
  adminLogin,
  adminRegister,
  adminLogout,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword
}; 