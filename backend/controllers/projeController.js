const Proje = require('../models/Proje');
const { validationResult } = require('express-validator');

// @desc    Tüm projeleri getir
// @route   GET /api/projeler
// @access  Public
const tumProjeleriGetir = async (req, res) => {
  try {
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
    const istatistikler = await Proje.aggregate([
      { $match: { aktif: true } },
      { $group: { _id: '$kategori', sayi: { $sum: 1 } } },
      { $sort: { sayi: -1 } }
    ]);

    res.json({ success: true, data: istatistikler });
  } catch (error) {
    console.error('İstatistikler getirilirken hata:', error);
    res.status(500).json({ 
      success: false, 
      message: 'İstatistikler getirilirken bir hata oluştu',
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
  kategoriIstatistikleri
}; 