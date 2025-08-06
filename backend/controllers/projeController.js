const Proje = require('../models/Project');
const Oy = require('../models/Vote');
const BasvuruTakip = require('../models/ApplicationTracking');
const { validationResult } = require('express-validator');

// @desc    Tüm projeleri getir
// @route   GET /api/projeler
// @access  Public
const tumProjeleriGetir = async (req, res) => {
  try {
    // MongoDB bağlantı durumunu kontrol et
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not ready, state:', mongoose.connection.readyState);
      return res.status(503).json({ 
        success: false, 
        message: 'Veritabanı bağlantısı henüz hazır değil. Lütfen birkaç saniye sonra tekrar deneyin.',
        error: 'Database connection not ready',
        state: mongoose.connection.readyState
      });
    }

    const { sayfa = 1, limit = 10, kategori, durum, arama } = req.query;
    
    // Filtreleme
    let filter = { aktif: true };
    if (kategori) filter.kategori = kategori;
    if (durum) filter.durum = durum;
    if (arama) {
      filter.$text = { $search: arama };
    }

    const projeler = await Proje.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((sayfa - 1) * limit)
      .exec();

    const toplam = await Proje.countDocuments(filter);

    res.json({
      projeler,
      toplamSayfa: Math.ceil(toplam / limit),
      mevcutSayfa: sayfa,
      toplamProje: toplam
    });
  } catch (error) {
    console.error('Projeler getirilirken hata:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Projeler getirilirken bir hata oluştu',
      error: error.message 
    });
  }
};

// @desc    Tek proje getir
// @route   GET /api/projeler/:id
// @access  Public
const projeGetir = async (req, res) => {
  try {
    const proje = await Proje.findById(req.params.id);
    
    if (!proje) {
      return res.status(404).json({ 
        success: false, 
        message: 'Proje bulunamadı' 
      });
    }

    res.json({ success: true, data: proje });
  } catch (error) {
    console.error('Proje getirilirken hata:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Proje getirilirken bir hata oluştu',
      error: error.message 
    });
  }
};

// @desc    Yeni proje oluştur
// @route   POST /api/projeler
// @access  Public
const projeOlustur = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const proje = await Proje.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Proje başarıyla oluşturuldu',
      data: proje 
    });
  } catch (error) {
    console.error('Proje oluşturulurken hata:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Proje oluşturulurken bir hata oluştu',
      error: error.message 
    });
  }
};

// @desc    Proje güncelle
// @route   PUT /api/projeler/:id
// @access  Public
const projeGuncelle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const proje = await Proje.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!proje) {
      return res.status(404).json({ 
        success: false, 
        message: 'Proje bulunamadı' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Proje başarıyla güncellendi',
      data: proje 
    });
  } catch (error) {
    console.error('Proje güncellenirken hata:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Proje güncellenirken bir hata oluştu',
      error: error.message 
    });
  }
};

// @desc    Proje sil (soft delete)
// @route   DELETE /api/projeler/:id
// @access  Public
const projeSil = async (req, res) => {
  try {
    const proje = await Proje.findByIdAndUpdate(
      req.params.id, 
      { aktif: false }, 
      { new: true }
    );

    if (!proje) {
      return res.status(404).json({ 
        success: false, 
        message: 'Proje bulunamadı' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Proje başarıyla silindi' 
    });
  } catch (error) {
    console.error('Proje silinirken hata:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Proje silinirken bir hata oluştu',
      error: error.message 
    });
  }
};

// @desc    Kategorilere göre proje sayıları
// @route   GET /api/projeler/istatistikler/kategori
// @access  Public
const kategoriIstatistikleri = async (req, res) => {
  try {
    // MongoDB bağlantı durumunu kontrol et
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not ready, state:', mongoose.connection.readyState);
      return res.status(503).json({ 
        success: false, 
        message: 'Veritabanı bağlantısı henüz hazır değil. Lütfen birkaç saniye sonra tekrar deneyin.',
        error: 'Database connection not ready',
        state: mongoose.connection.readyState
      });
    }

    // Timeout süresini artır ve daha basit bir sorgu kullan
    const istatistikler = await Proje.aggregate([
      { $match: { aktif: true } },
      { $group: { _id: '$kategori', sayi: { $sum: 1 } } },
      { $sort: { sayi: -1 } }
    ], {
      maxTimeMS: 30000, // 30 saniye timeout
      allowDiskUse: true // Büyük veri setleri için disk kullanımına izin ver
    });

    res.json({ success: true, data: istatistikler });
  } catch (error) {
    console.error('İstatistikler getirilirken hata:', error);
    
    // Eğer aggregation timeout olursa, alternatif yöntem kullan
    if (error.message.includes('timed out') || error.message.includes('buffering timed out')) {
      try {
        console.log('Aggregation timeout, alternatif yöntem kullanılıyor...');
        
        // Basit find sorgusu ile istatistikleri hesapla
        const kategoriler = ['Teknoloji', 'Sağlık', 'Eğitim', 'Çevre', 'Sosyal', 'Diğer'];
        const istatistikler = [];
        
        for (const kategori of kategoriler) {
          const sayi = await Proje.countDocuments({ 
            aktif: true, 
            kategori: kategori 
          });
          if (sayi > 0) {
            istatistikler.push({ _id: kategori, sayi });
          }
        }
        
        // Sayıya göre sırala
        istatistikler.sort((a, b) => b.sayi - a.sayi);
        
        res.json({ success: true, data: istatistikler });
        return;
      } catch (fallbackError) {
        console.error('Fallback yöntem de başarısız:', fallbackError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'İstatistikler getirilirken bir hata oluştu',
      error: error.message 
    });
  }
};

// @desc    Oy ver
// @route   POST /api/projeler/:id/oy
// @access  Public
const oyVer = async (req, res) => {
  try {
    const { oy, yorum, kriterler, email } = req.body;
    const projeId = req.params.id;
    const kullaniciIP = req.ip || req.connection.remoteAddress;

    // Proje var mı kontrol et
    const proje = await Proje.findById(projeId);
    if (!proje) {
      return res.status(404).json({
        success: false,
        message: 'Proje bulunamadı'
      });
    }

    // Daha önce oy verilmiş mi kontrol et
    const mevcutOy = await Oy.findOne({
      projeId,
      $or: [
        { kullaniciIP },
        { kullaniciEmail: email }
      ]
    });

    if (mevcutOy) {
      return res.status(400).json({
        success: false,
        message: 'Bu projeye daha önce oy vermişsiniz'
      });
    }

    // Yeni oy oluştur
    const yeniOy = await Oy.create({
      projeId,
      kullaniciIP,
      kullaniciEmail: email,
      oy,
      yorum,
      kriterler
    });

    res.status(201).json({
      success: true,
      message: 'Oy başarıyla verildi',
      data: yeniOy
    });

  } catch (error) {
    console.error('Oy verilirken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Oy verilirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Başvuru takip bilgisi getir
// @route   GET /api/basvuru-takip/:email
// @access  Public
const basvuruTakipGetir = async (req, res) => {
  try {
    const { email } = req.params;

    const basvurular = await BasvuruTakip.find({ email })
      .populate('projeId')
      .sort({ sonGuncelleme: -1 });

    res.json({
      success: true,
      data: basvurular
    });

  } catch (error) {
    console.error('Başvuru takip getirilirken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Başvuru takip bilgisi getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Moderation için tüm başvuruları getir
// @route   GET /api/moderation/basvurular
// @access  Public (admin kontrolü frontend'de)
const moderationBasvurularGetir = async (req, res) => {
  try {
    const { durum, tur, kategori, sayfa = 1, limit = 10 } = req.query;

    let filter = {};
    if (durum && durum !== 'Tümü') filter.durum = durum;
    if (tur && tur !== 'Tümü') filter.tur = tur;
    if (kategori && kategori !== 'Tümü') filter.kategori = kategori;

    const projeler = await Proje.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((sayfa - 1) * limit)
      .exec();

    const toplam = await Proje.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projeler,
        toplamSayfa: Math.ceil(toplam / limit),
        mevcutSayfa: parseInt(sayfa),
        toplamProje: toplam
      }
    });

  } catch (error) {
    console.error('Moderation başvuruları getirilirken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Başvurular getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Başvuru durumunu güncelle (moderation)
// @route   PUT /api/moderation/basvurular/:id
// @access  Public (admin kontrolü frontend'de)
const basvuruDurumGuncelle = async (req, res) => {
  try {
    const { durum, adminNotu } = req.body;
    const projeId = req.params.id;

    const proje = await Proje.findByIdAndUpdate(
      projeId,
      { durum },
      { new: true }
    );

    if (!proje) {
      return res.status(404).json({
        success: false,
        message: 'Başvuru bulunamadı'
      });
    }

    // Başvuru takip kaydını güncelle
    const basvuruTakip = await BasvuruTakip.findOne({ projeId });
    if (basvuruTakip) {
      basvuruTakip.durumGecmisi.push({
        durum,
        tarih: new Date(),
        aciklama: `Durum ${durum} olarak güncellendi`,
        adminNotu
      });
      await basvuruTakip.save();
    }

    res.json({
      success: true,
      message: 'Başvuru durumu başarıyla güncellendi',
      data: proje
    });

  } catch (error) {
    console.error('Başvuru durumu güncellenirken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Başvuru durumu güncellenirken bir hata oluştu',
      error: error.message
    });
  }
};

// @desc    Oylama için onaylanmış projeleri getir
// @route   GET /api/oylamalar
// @access  Public
const oylamaProjeleriGetir = async (req, res) => {
  try {
    const { kategori, siralama = 'yeni', sayfa = 1, limit = 10 } = req.query;

    let filter = { durum: 'Onaylandı', aktif: true };
    if (kategori && kategori !== 'Tümü') filter.kategori = kategori;

    let sort = {};
    switch (siralama) {
      case 'yeni':
        sort = { createdAt: -1 };
        break;
      case 'eski':
        sort = { createdAt: 1 };
        break;
      case 'populer':
        sort = { oySayisi: -1 };
        break;
      case 'enCokOy':
        sort = { ortalamaOy: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const projeler = await Proje.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((sayfa - 1) * limit)
      .exec();

    const toplam = await Proje.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projeler,
        toplamSayfa: Math.ceil(toplam / limit),
        mevcutSayfa: parseInt(sayfa),
        toplamProje: toplam
      }
    });

  } catch (error) {
    console.error('Oylama projeleri getirilirken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Oylama projeleri getirilirken bir hata oluştu',
      error: error.message
    });
  }
};

module.exports = {
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
}; 