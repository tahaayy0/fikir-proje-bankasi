const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Token tipine göre kullanıcı veya admin kontrolü
    if (decoded.type === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-sifre');
      
      if (!admin || !admin.aktif) {
        return res.status(401).json({
          success: false,
          message: 'Geçersiz token veya admin hesabı aktif değil'
        });
      }

      req.admin = { ...admin.toObject(), id: admin._id };
      req.userType = 'admin';
    } else if (decoded.type === 'user') {
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Geçersiz token veya kullanıcı hesabı aktif değil'
        });
      }

      req.user = user;
      req.userType = 'user';
    } else {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token tipi'
      });
    }

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

// Admin yetkisi kontrolü
const requireAdmin = (req, res, next) => {
  if (!req.admin || req.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin yetkisi gerekli'
    });
  }
  next();
};

// User yetkisi kontrolü
const requireUser = (req, res, next) => {
  if (!req.user || req.userType !== 'user') {
    return res.status(403).json({
      success: false,
      message: 'Kullanıcı yetkisi gerekli'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireUser
}; 