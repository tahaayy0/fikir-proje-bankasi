const express = require('express');
const router = express.Router();
const {
  tumProjeleriGetir,
  projeGetir,
  projeOlustur,
  projeGuncelle,
  projeSil,
  kategoriIstatistikleri
} = require('../controllers/projeController');
const { projeValidasyon } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Proje:
 *       type: object
 *       required:
 *         - baslik
 *         - aciklama
 *         - olusturanKisi
 *       properties:
 *         _id:
 *           type: string
 *           description: Proje ID'si
 *         baslik:
 *           type: string
 *           description: Proje başlığı
 *           maxLength: 100
 *         aciklama:
 *           type: string
 *           description: Proje açıklaması
 *           maxLength: 1000
 *         kategori:
 *           type: string
 *           enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Diğer]
 *           description: Proje kategorisi
 *           default: Diğer
 *         durum:
 *           type: string
 *           enum: [Taslak, Aktif, Tamamlandı, İptal]
 *           description: Proje durumu
 *           default: Taslak
 *         oncelik:
 *           type: string
 *           enum: [Düşük, Orta, Yüksek, Kritik]
 *           description: Proje önceliği
 *           default: Orta
 *         baslangicTarihi:
 *           type: string
 *           format: date-time
 *           description: Proje başlangıç tarihi
 *         bitisTarihi:
 *           type: string
 *           format: date-time
 *           description: Proje bitiş tarihi
 *         butce:
 *           type: number
 *           minimum: 0
 *           description: Proje bütçesi
 *         etiketler:
 *           type: array
 *           items:
 *             type: string
 *           description: Proje etiketleri
 *         olusturanKisi:
 *           type: string
 *           description: Projeyi oluşturan kişi
 *           maxLength: 100
 *         aktif:
 *           type: boolean
 *           description: Proje aktif durumu
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Güncellenme tarihi
 *         sure:
 *           type: number
 *           description: Proje süresi (gün)
 */

/**
 * @swagger
 * /api/projeler:
 *   get:
 *     summary: Tüm projeleri listele
 *     tags: [Projeler]
 *     parameters:
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
 *       - in: query
 *         name: kategori
 *         schema:
 *           type: string
 *           enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Diğer]
 *         description: Kategori filtresi
 *       - in: query
 *         name: durum
 *         schema:
 *           type: string
 *           enum: [Taslak, Aktif, Tamamlandı, İptal]
 *         description: Durum filtresi
 *       - in: query
 *         name: arama
 *         schema:
 *           type: string
 *         description: Başlık ve açıklamada arama
 *     responses:
 *       200:
 *         description: Projeler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projeler:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Proje'
 *                 toplamSayfa:
 *                   type: integer
 *                 mevcutSayfa:
 *                   type: integer
 *                 toplamProje:
 *                   type: integer
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', tumProjeleriGetir);

/**
 * @swagger
 * /api/projeler/{id}:
 *   get:
 *     summary: ID ile proje getir
 *     tags: [Projeler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Proje ID'si
 *     responses:
 *       200:
 *         description: Proje başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Proje'
 *       404:
 *         description: Proje bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/:id', projeGetir);

/**
 * @swagger
 * /api/projeler:
 *   post:
 *     summary: Yeni proje oluştur
 *     tags: [Projeler]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - baslik
 *               - aciklama
 *               - olusturanKisi
 *             properties:
 *               baslik:
 *                 type: string
 *                 maxLength: 100
 *               aciklama:
 *                 type: string
 *                 maxLength: 1000
 *               kategori:
 *                 type: string
 *                 enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Diğer]
 *               durum:
 *                 type: string
 *                 enum: [Taslak, Aktif, Tamamlandı, İptal]
 *               oncelik:
 *                 type: string
 *                 enum: [Düşük, Orta, Yüksek, Kritik]
 *               baslangicTarihi:
 *                 type: string
 *                 format: date-time
 *               bitisTarihi:
 *                 type: string
 *                 format: date-time
 *               butce:
 *                 type: number
 *                 minimum: 0
 *               etiketler:
 *                 type: array
 *                 items:
 *                   type: string
 *               olusturanKisi:
 *                 type: string
 *                 maxLength: 100
 *     responses:
 *       201:
 *         description: Proje başarıyla oluşturuldu
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
 *                   $ref: '#/components/schemas/Proje'
 *       400:
 *         description: Validasyon hatası
 *       500:
 *         description: Sunucu hatası
 */
router.post('/', projeValidasyon, projeOlustur);

/**
 * @swagger
 * /api/projeler/{id}:
 *   put:
 *     summary: Proje güncelle
 *     tags: [Projeler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Proje ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proje'
 *     responses:
 *       200:
 *         description: Proje başarıyla güncellendi
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
 *                   $ref: '#/components/schemas/Proje'
 *       400:
 *         description: Validasyon hatası
 *       404:
 *         description: Proje bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.put('/:id', projeValidasyon, projeGuncelle);

/**
 * @swagger
 * /api/projeler/{id}:
 *   delete:
 *     summary: Proje sil (soft delete)
 *     tags: [Projeler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Proje ID'si
 *     responses:
 *       200:
 *         description: Proje başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Proje bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete('/:id', projeSil);

/**
 * @swagger
 * /api/projeler/istatistikler/kategori:
 *   get:
 *     summary: Kategorilere göre proje istatistikleri
 *     tags: [Projeler]
 *     responses:
 *       200:
 *         description: İstatistikler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       sayi:
 *                         type: integer
 *       500:
 *         description: Sunucu hatası
 */
router.get('/istatistikler/kategori', kategoriIstatistikleri);

module.exports = router; 