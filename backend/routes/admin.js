const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const validateLogin = [
  body('mail').isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('sifre').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır')
];

const validateRegister = [
  body('isim').trim().isLength({ min: 2, max: 50 }).withMessage('İsim 2-50 karakter arasında olmalıdır'),
  body('soyisim').trim().isLength({ min: 2, max: 50 }).withMessage('Soyisim 2-50 karakter arasında olmalıdır'),
  body('mail').isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('sifre').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır')
];

const validateProfileUpdate = [
  body('isim').optional().trim().isLength({ min: 2, max: 50 }).withMessage('İsim 2-50 karakter arasında olmalıdır'),
  body('soyisim').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Soyisim 2-50 karakter arasında olmalıdır'),
  body('mail').optional().isEmail().withMessage('Geçerli bir e-posta adresi giriniz')
];

const validatePasswordChange = [
  body('mevcutSifre').isLength({ min: 6 }).withMessage('Mevcut şifre en az 6 karakter olmalıdır'),
  body('yeniSifre').isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalıdır')
];

// Public routes (authentication gerekmez)
router.post('/register', validateRegister, adminController.register);
router.post('/login', validateLogin, adminController.login);

// Protected routes (authentication gerekir)
router.get('/profile', authenticateToken, requireAdmin, adminController.getProfile);
router.put('/profile', authenticateToken, requireAdmin, validateProfileUpdate, adminController.updateProfile);
router.put('/change-password', authenticateToken, requireAdmin, validatePasswordChange, adminController.changePassword);
router.post('/logout', authenticateToken, requireAdmin, adminController.logout);

module.exports = router; 