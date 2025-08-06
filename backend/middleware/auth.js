const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// JWT token doğrulama middleware'i
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Erişim token\'ı bulunamadı'
      });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Admin'i veritabanından kontrol et
    const admin = await Admin.findById(decoded.adminId).select('-sifre');
    
    if (!admin || !admin.aktif) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token veya admin hesabı aktif değil'
      });
    }

    // Admin bilgisini request'e ekle
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Token doğrulama hatası'
    });
  }
};

// Admin yetkisi kontrolü (opsiyonel - gelecekte farklı roller için)
const requireAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(403).json({
      success: false,
      message: 'Admin yetkisi gerekli'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
}; 