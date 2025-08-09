const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const validateUserRegister = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Ad 2-100 karakter arasında olmalıdır'),
  body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır')
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır')
];

const validateProfileUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Ad 2-100 karakter arasında olmalıdır'),
  body('email').optional().isEmail().withMessage('Geçerli bir e-posta adresi giriniz'),
  body('profile.bio').optional().isLength({ max: 500 }).withMessage('Biyografi 500 karakterden uzun olamaz')
];

const validatePasswordChange = [
  body('currentPassword').isLength({ min: 6 }).withMessage('Mevcut şifre en az 6 karakter olmalıdır'),
  body('newPassword').isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalıdır')
];

// Public routes (authentication gerekmez)
router.post('/register', validateUserRegister, userController.userRegister);
router.post('/login', validateUserLogin, userController.userLogin);

// Protected routes (authentication gerekir)
router.get('/profile', authenticateToken, requireUser, userController.getUserProfile);
router.put('/profile', authenticateToken, requireUser, validateProfileUpdate, userController.updateUserProfile);
router.put('/change-password', authenticateToken, requireUser, validatePasswordChange, userController.changeUserPassword);
router.post('/logout', authenticateToken, requireUser, userController.userLogout);

module.exports = router;
