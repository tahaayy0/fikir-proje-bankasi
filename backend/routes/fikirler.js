const express = require('express');
const router = express.Router();
const { fikirOlustur } = require('../controllers/projeController');
const { fikirValidasyon } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Fikir:
 *       type: object
 *       required:
 *         - baslik
 *         - kisaAciklama
 *         - problem
 *         - hedefKitle
 *         - kategori
 *         - adSoyad
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: Fikir ID'si
 *         baslik:
 *           type: string
 *           description: Fikir başlığı
 *           maxLength: 100
 *         kisaAciklama:
 *           type: string
 *           description: Kısa açıklama
 *           maxLength: 280
 *         problem:
 *           type: string
 *           description: Problem açıklaması
 *           maxLength: 500
 *         hedefKitle:
 *           type: string
 *           description: Hedef kitle
 *           maxLength: 300
 *         kategori:
 *           type: string
 *           enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Ekonomi, Kültür, Diğer]
 *           description: Kategori
 *         olgunlukSeviyesi:
 *           type: string
 *           enum: [fikir, mvp, yayinda]
 *           description: Olgunluk seviyesi
 *         kaynaklar:
 *           type: string
 *           description: Gerekli kaynaklar
 *           maxLength: 500
 *         dosyaLink:
 *           type: string
 *           description: Destekleyici dosya/link
 *         adSoyad:
 *           type: string
 *           description: Başvuran ad soyad
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: E-posta adresi
 *         telefon:
 *           type: string
 *           description: Telefon numarası
 *           maxLength: 20
 *         durum:
 *           type: string
 *           enum: [Beklemede, Onaylandı, Reddedildi, Düzeltme Talebi, Aktif, Tamamlandı]
 *           description: Durum
 *         oncelik:
 *           type: string
 *           enum: [Düşük, Orta, Yüksek, Kritik]
 *           description: Öncelik
 *         oySayisi:
 *           type: number
 *           description: Oy sayısı
 *         toplamOy:
 *           type: number
 *           description: Toplam oy
 *         ortalamaOy:
 *           type: number
 *           description: Ortalama oy
 *         aktif:
 *           type: boolean
 *           description: Aktif durumu
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Güncellenme tarihi
 */

/**
 * @swagger
 * /api/fikirler:
 *   post:
 *     summary: Yeni fikir başvurusu oluştur
 *     tags: [Fikirler]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - baslik
 *               - kisaAciklama
 *               - problem
 *               - hedefKitle
 *               - kategori
 *               - adSoyad
 *               - email
 *             properties:
 *               baslik:
 *                 type: string
 *                 maxLength: 100
 *                 description: Fikir başlığı
 *               kisaAciklama:
 *                 type: string
 *                 maxLength: 280
 *                 description: Kısa açıklama
 *               problem:
 *                 type: string
 *                 maxLength: 500
 *                 description: Problem açıklaması
 *               hedefKitle:
 *                 type: string
 *                 maxLength: 300
 *                 description: Hedef kitle
 *               kategori:
 *                 type: string
 *                 enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Ekonomi, Kültür, Diğer]
 *                 description: Kategori
 *               olgunlukSeviyesi:
 *                 type: string
 *                 enum: [fikir, mvp, yayinda]
 *                 description: Olgunluk seviyesi
 *               kaynaklar:
 *                 type: string
 *                 maxLength: 500
 *                 description: Gerekli kaynaklar
 *               dosyaLink:
 *                 type: string
 *                 description: Destekleyici dosya/link
 *               adSoyad:
 *                 type: string
 *                 maxLength: 100
 *                 description: Başvuran ad soyad
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-posta adresi
 *               telefon:
 *                 type: string
 *                 maxLength: 20
 *                 description: Telefon numarası
 *     responses:
 *       201:
 *         description: Fikir başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Fikir'
 *       400:
 *         description: Validasyon hatası
 *       500:
 *         description: Sunucu hatası
 */
router.post('/', fikirValidasyon, fikirOlustur);

module.exports = router; 