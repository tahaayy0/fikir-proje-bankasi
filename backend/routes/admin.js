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
  body('ad').trim().isLength({ min: 2, max: 100 }).withMessage('Ad 2-100 karakter arasında olmalıdır'),
  body('mail').isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('sifre').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır')
];

const validateProfileUpdate = [
  body('ad').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Ad 2-100 karakter arasında olmalıdır'),
  body('mail').optional().isEmail().withMessage('Geçerli bir e-posta adresi giriniz')
];

const validatePasswordChange = [
  body('mevcutSifre').isLength({ min: 6 }).withMessage('Mevcut şifre en az 6 karakter olmalıdır'),
  body('yeniSifre').isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalıdır')
];

// Public routes (authentication gerekmez)
router.post('/register', validateRegister, adminController.adminRegister);
router.post('/login', validateLogin, adminController.adminLogin);

// Protected routes (authentication gerekir)
router.get('/profile', authenticateToken, requireAdmin, adminController.getAdminProfile);
router.put('/profile', authenticateToken, requireAdmin, validateProfileUpdate, adminController.updateAdminProfile);
router.put('/change-password', authenticateToken, requireAdmin, validatePasswordChange, adminController.changeAdminPassword);
router.post('/logout', authenticateToken, requireAdmin, adminController.adminLogout);

module.exports = router; 