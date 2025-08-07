const express = require('express');
const router = express.Router();
const {
  tumProjeleriGetir,
  projeGetir,
  projeOlustur,
  projeGuncelle,
  projeSil,
  kategoriIstatistikleri,
  oyVer,
  basvuruTakipGetir,
  moderationBasvurularGetir,
  basvuruDurumGuncelle,
  oylamaProjeleriGetir
} = require('../controllers/projeController');
const { projeValidasyon, oyValidasyon } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Proje:
 *       type: object
 *       required:
 *         - baslik
 *         - aciklama
 *         - tur
 *         - problem
 *         - hedefKitle
 *         - olusturanKisi
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: Proje ID'si
 *         baslik:
 *           type: string
 *           description: Başlık
 *           maxLength: 100
 *         aciklama:
 *           type: string
 *           description: Açıklama
 *           maxLength: 1000
 *         tur:
 *           type: string
 *           enum: [fikir, proje]
 *           description: Tür (fikir veya proje)
 *           default: fikir
 *         kategori:
 *           type: string
 *           enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Ekonomi, Kültür, Diğer]
 *           description: Kategori
 *           default: Diğer
 *         problem:
 *           type: string
 *           description: Problem açıklaması
 *           maxLength: 500
 *         hedefKitle:
 *           type: string
 *           description: Hedef kitle
 *           maxLength: 300
 *         olgunlukSeviyesi:
 *           type: string
 *           enum: [fikir, mvp, prototip, yayinda, gelistirme]
 *           description: Olgunluk seviyesi
 *           default: fikir
 *         kaynaklar:
 *           type: string
 *           description: Gerekli kaynaklar
 *           maxLength: 500
 *         butce:
 *           type: number
 *           minimum: 0
 *           description: Bütçe
 *         baslangicTarihi:
 *           type: string
 *           format: date-time
 *           description: Başlangıç tarihi
 *         bitisTarihi:
 *           type: string
 *           format: date-time
 *           description: Bitiş tarihi
 *         dosyaLink:
 *           type: string
 *           description: Dosya/link URL'i
 *         olusturanKisi:
 *           type: string
 *           description: Oluşturan kişi
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: E-posta adresi
 *         telefon:
 *           type: string
 *           description: Telefon numarası
 *           maxLength: 20
 *         teknolojiler:
 *           type: string
 *           description: Kullanılacak teknolojiler
 *           maxLength: 300
 *         takimUyeleri:
 *           type: string
 *           description: Takım üyeleri
 *           maxLength: 500
 *         hedefler:
 *           type: string
 *           description: Proje hedefleri
 *           maxLength: 500
 *         durum:
 *           type: string
 *           enum: [Beklemede, Onaylandı, Reddedildi, Düzeltme Talebi, Aktif, Tamamlandı]
 *           description: Durum
 *           default: Beklemede
 *         oncelik:
 *           type: string
 *           enum: [Düşük, Orta, Yüksek, Kritik]
 *           description: Öncelik
 *           default: Orta
 *         oySayisi:
 *           type: number
 *           description: Oy sayısı
 *           default: 0
 *         toplamOy:
 *           type: number
 *           description: Toplam oy
 *           default: 0
 *         ortalamaOy:
 *           type: number
 *           description: Ortalama oy
 *           default: 0
 *         aktif:
 *           type: boolean
 *           description: Aktif durumu
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Güncellenme tarihi
 *     
 *     Oy:
 *       type: object
 *       required:
 *         - projeId
 *         - kullaniciIP
 *         - oy
 *         - kriterler
 *       properties:
 *         _id:
 *           type: string
 *           description: Oy ID'si
 *         projeId:
 *           type: string
 *           description: Proje ID'si
 *         kullaniciIP:
 *           type: string
 *           description: Kullanıcı IP adresi
 *         kullaniciEmail:
 *           type: string
 *           format: email
 *           description: Kullanıcı e-posta adresi
 *         oy:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Oy değeri (1-5)
 *         yorum:
 *           type: string
 *           maxLength: 500
 *           description: Yorum
 *         kriterler:
 *           type: object
 *           properties:
 *             toplulukFaydasi:
 *               type: integer
 *               minimum: 1
 *               maximum: 5
 *               description: Topluluk faydası
 *             problemCozumu:
 *               type: integer
 *               minimum: 1
 *               maximum: 5
 *               description: Problem çözümü
 *             uygulanabilirlik:
 *               type: integer
 *               minimum: 1
 *               maximum: 5
 *               description: Uygulanabilirlik
 *             surdurulebilirlik:
 *               type: integer
 *               minimum: 1
 *               maximum: 5
 *               description: Sürdürülebilirlik
 *             ilgiCekicilik:
 *               type: integer
 *               minimum: 1
 *               maximum: 5
 *               description: İlgi çekicilik
 *         aktif:
 *           type: boolean
 *           description: Aktif durumu
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *     
 *     BasvuruTakip:
 *       type: object
 *       required:
 *         - projeId
 *         - email
 *         - takipKodu
 *       properties:
 *         _id:
 *           type: string
 *           description: Başvuru takip ID'si
 *         projeId:
 *           type: string
 *           description: Proje ID'si
 *         email:
 *           type: string
 *           format: email
 *           description: E-posta adresi
 *         takipKodu:
 *           type: string
 *           description: Takip kodu
 *         durumGecmisi:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               durum:
 *                 type: string
 *                 enum: [Beklemede, Onaylandı, Reddedildi, Düzeltme Talebi, Aktif, Tamamlandı]
 *               tarih:
 *                 type: string
 *                 format: date-time
 *               aciklama:
 *                 type: string
 *                 maxLength: 500
 *               adminNotu:
 *                 type: string
 *                 maxLength: 1000
 *         sonGuncelleme:
 *           type: string
 *           format: date-time
 *           description: Son güncelleme tarihi
 *         aktif:
 *           type: boolean
 *           description: Aktif durumu
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
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
 *           enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Ekonomi, Kültür, Diğer]
 *         description: Kategori filtresi
 *       - in: query
 *         name: durum
 *         schema:
 *           type: string
 *           enum: [Beklemede, Onaylandı, Reddedildi, Düzeltme Talebi, Aktif, Tamamlandı]
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
 *     summary: Yeni fikir/proje başvurusu oluştur
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
 *               - tur
 *               - problem
 *               - hedefKitle
 *               - olusturanKisi
 *               - email
 *             properties:
 *               baslik:
 *                 type: string
 *                 maxLength: 100
 *                 description: Başlık
 *               aciklama:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Açıklama
 *               tur:
 *                 type: string
 *                 enum: [fikir, proje]
 *                 description: Tür (fikir veya proje)
 *               kategori:
 *                 type: string
 *                 enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Ekonomi, Kültür, Diğer]
 *                 description: Kategori
 *               problem:
 *                 type: string
 *                 maxLength: 500
 *                 description: Problem açıklaması
 *               hedefKitle:
 *                 type: string
 *                 maxLength: 300
 *                 description: Hedef kitle
 *               olgunlukSeviyesi:
 *                 type: string
 *                 enum: [fikir, mvp, prototip, yayinda, gelistirme]
 *                 description: Olgunluk seviyesi
 *               kaynaklar:
 *                 type: string
 *                 maxLength: 500
 *                 description: Gerekli kaynaklar
 *               butce:
 *                 type: number
 *                 minimum: 0
 *                 description: Bütçe
 *               baslangicTarihi:
 *                 type: string
 *                 format: date-time
 *                 description: Başlangıç tarihi
 *               bitisTarihi:
 *                 type: string
 *                 format: date-time
 *                 description: Bitiş tarihi
 *               dosyaLink:
 *                 type: string
 *                 description: Dosya/link URL'i
 *               olusturanKisi:
 *                 type: string
 *                 maxLength: 100
 *                 description: Oluşturan kişi
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-posta adresi
 *               telefon:
 *                 type: string
 *                 maxLength: 20
 *                 description: Telefon numarası
 *               teknolojiler:
 *                 type: string
 *                 maxLength: 300
 *                 description: Kullanılacak teknolojiler (sadece proje türü için)
 *               takimUyeleri:
 *                 type: string
 *                 maxLength: 500
 *                 description: Takım üyeleri (sadece proje türü için)
 *               hedefler:
 *                 type: string
 *                 maxLength: 500
 *                 description: Proje hedefleri (sadece proje türü için)
 *     responses:
 *       201:
 *         description: Başvuru başarıyla oluşturuldu
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
 *     summary: Kategorilere göre fikir/proje istatistikleri
 *     tags: [İstatistikler]
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
 *                         description: Kategori adı
 *                       sayi:
 *                         type: integer
 *                         description: Kategoriye ait fikir/proje sayısı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/istatistikler/kategori', kategoriIstatistikleri);

/**
 * @swagger
 * /api/projeler/{id}/oy:
 *   post:
 *     summary: Projeye oy ver
 *     tags: [Oylama]
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
 *             type: object
 *             required:
 *               - oy
 *               - kriterler
 *             properties:
 *               oy:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Oy değeri (1-5)
 *               yorum:
 *                 type: string
 *                 maxLength: 500
 *                 description: Yorum (opsiyonel)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-posta adresi (opsiyonel)
 *               kriterler:
 *                 type: object
 *                 required:
 *                   - toplulukFaydasi
 *                   - problemCozumu
 *                   - uygulanabilirlik
 *                   - surdurulebilirlik
 *                   - ilgiCekicilik
 *                 properties:
 *                   toplulukFaydasi:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     description: Topluluk faydası
 *                   problemCozumu:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     description: Problem çözümü
 *                   uygulanabilirlik:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     description: Uygulanabilirlik
 *                   surdurulebilirlik:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     description: Sürdürülebilirlik
 *                   ilgiCekicilik:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     description: İlgi çekicilik
 *     responses:
 *       201:
 *         description: Oy başarıyla verildi
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
 *                   $ref: '#/components/schemas/Oy'
 *       400:
 *         description: Validasyon hatası veya daha önce oy verilmiş
 *       404:
 *         description: Proje bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.post('/:id/oy', oyValidasyon, oyVer);

/**
 * @swagger
 * /api/projeler/basvuru-takip/{email}:
 *   get:
 *     summary: E-posta ile başvuru takip bilgisi getir
 *     tags: [Başvuru Takip]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: E-posta adresi
 *     responses:
 *       200:
 *         description: Başvuru takip bilgileri başarıyla getirildi
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
 *                     $ref: '#/components/schemas/BasvuruTakip'
 *       500:
 *         description: Sunucu hatası
 */
router.get('/basvuru-takip/:email', basvuruTakipGetir);

/**
 * @swagger
 * /api/projeler/moderation/basvurular:
 *   get:
 *     summary: Moderation için tüm başvuruları getir
 *     tags: [Moderation]
 *     parameters:
 *       - in: query
 *         name: durum
 *         schema:
 *           type: string
 *           enum: [Beklemede, Onaylandı, Reddedildi, Düzeltme Talebi, Aktif, Tamamlandı, Tümü]
 *         description: Durum filtresi
 *       - in: query
 *         name: tur
 *         schema:
 *           type: string
 *           enum: [fikir, proje, Tümü]
 *         description: Tür filtresi
 *       - in: query
 *         name: kategori
 *         schema:
 *           type: string
 *           enum: [Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Ekonomi, Kültür, Diğer, Tümü]
 *         description: Kategori filtresi
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
 *         description: Sayfa başına başvuru sayısı
 *     responses:
 *       200:
 *         description: Başvurular başarıyla getirildi
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
router.get('/moderation/basvurular', moderationBasvurularGetir);

/**
 * @swagger
 * /api/projeler/moderation/basvurular/{id}:
 *   put:
 *     summary: Başvuru durumunu güncelle (moderation)
 *     tags: [Moderation]
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
 *             type: object
 *             required:
 *               - durum
 *             properties:
 *               durum:
 *                 type: string
 *                 enum: [Beklemede, Onaylandı, Reddedildi, Düzeltme Talebi, Aktif, Tamamlandı]
 *                 description: Yeni durum
 *               adminNotu:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Admin notu (opsiyonel)
 *     responses:
 *       200:
 *         description: Başvuru durumu başarıyla güncellendi
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
 *       404:
 *         description: Başvuru bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.put('/moderation/basvurular/:id', basvuruDurumGuncelle);

/**
 * @swagger
 * /api/projeler/oylamalar:
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
module.exports = router; 