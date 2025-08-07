const express = require('express');
const router = express.Router();
const { oylamaProjeleriGetir } = require('../controllers/projeController');

/**
 * @swagger
 * /api/oylamalar:
 *   get:
 *     summary: Oylama için onaylanmış projeleri getir
 *     tags: [Oylama]
 *     parameters:
 *       - in: query
 *         name: kategori
 *         schema:
 *           type: string
 *           enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Ekonomi, Kültür, Diğer, Tümü]
 *         description: Kategori filtresi
 *       - in: query
 *         name: siralama
 *         schema:
 *           type: string
 *           enum: [yeni, eski, populer, enCokOy]
 *           default: yeni
 *         description: Sıralama türü
 *       - in: query
 *         name: sayfa
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına proje sayısı
 *     responses:
 *       200:
 *         description: Oylama projeleri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     projeler:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Proje'
 *                     toplamSayfa:
 *                       type: integer
 *                     mevcutSayfa:
 *                       type: integer
 *                     toplamProje:
 *                       type: integer
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', oylamaProjeleriGetir);

module.exports = router; 