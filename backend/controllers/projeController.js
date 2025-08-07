const Proje = require('../models/Project');
const Idea = require('../models/Idea');
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

    // Gelen veriyi hazırla
    const projeData = {
      ...req.body,
      createdAt: new Date(),
      aktif: true
    };

    // Fikir formu için özel alanları kontrol et
    if (projeData.tur === 'fikir') {
      // Fikir formundan gelen veriler için kisaAciklama alanını aciklama'ya kopyala
      if (projeData.kisaAciklama && !projeData.aciklama) {
        projeData.aciklama = projeData.kisaAciklama;
      }
      
      // Fikir formu için olusturanKisi alanını adSoyad'dan al
      if (projeData.adSoyad && !projeData.olusturanKisi) {
        projeData.olusturanKisi = projeData.adSoyad;
      }
    }

    // Proje oluştur
    const proje = await Proje.create(projeData);
    
    // Başvuru takip kaydı oluştur
    try {
      const BasvuruTakip = require('../models/ApplicationTracking');
      const takipKodu = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      await BasvuruTakip.create({
        projeId: proje._id,
        email: projeData.email,
        takipKodu: takipKodu,
        durumGecmisi: [{
          durum: 'Beklemede',
          tarih: new Date(),
          aciklama: 'Başvuru alındı ve inceleme sürecine alındı'
        }],
        sonGuncelleme: new Date()
      });
    } catch (takipError) {
      console.error('Başvuru takip kaydı oluşturulurken hata:', takipError);
      // Başvuru takip hatası ana işlemi etkilemesin
    }
    
    console.log('Yeni başvuru oluşturuldu:', {
      id: proje._id,
      tur: proje.tur,
      baslik: proje.baslik,
      email: proje.email,
      tarih: proje.createdAt
    });
    
    res.status(201).json({ 
      success: true, 
      message: projeData.tur === 'fikir' ? 'Fikriniz başarıyla gönderildi! Admin onayından sonra topluluk oylamasına açılacak.' : 'Projeniz başarıyla gönderildi! Admin onayından sonra topluluk oylamasına açılacak.',
      data: proje 
    });
  } catch (error) {
    console.error('Proje oluşturulurken hata:', error);
    
    // MongoDB validation hatalarını daha detaylı göster
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({ 
        success: false, 
        message: 'Veri doğrulama hatası',
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Proje oluşturulurken bir hata oluştu',
      error: error.message 
    });
  }
};

// @desc    Yeni fikir oluştur (Idea modeli ile)
// @route   POST /api/fikirler
// @access  Public
const fikirOlustur = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    // Fikir verisini hazırla
    const fikirData = {
      ...req.body,
      createdAt: new Date(),
      aktif: true
    };

    // Idea modeli ile fikir oluştur
    const fikir = await Idea.create(fikirData);
    
    // Başvuru takip kaydı oluştur
    try {
      const takipKodu = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      await BasvuruTakip.create({
        projeId: fikir._id,
        email: fikirData.email,
        takipKodu: takipKodu,
        durumGecmisi: [{
          durum: 'Beklemede',
          tarih: new Date(),
          aciklama: 'Fikir başvurusu alındı ve inceleme sürecine alındı'
        }],
        sonGuncelleme: new Date()
      });
    } catch (takipError) {
      console.error('Başvuru takip kaydı oluşturulurken hata:', takipError);
    }
    
    console.log('Yeni fikir oluşturuldu:', {
      id: fikir._id,
      baslik: fikir.baslik,
      email: fikir.email,
      tarih: fikir.createdAt
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Fikriniz başarıyla gönderildi! Admin onayından sonra topluluk oylamasına açılacak.',
      data: fikir 
    });
  } catch (error) {
    console.error('Fikir oluşturulurken hata:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({ 
        success: false, 
        message: 'Veri doğrulama hatası',
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Fikir oluşturulurken bir hata oluştu',
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

    // Proje oy sayılarını güncelle
    const yeniOySayisi = (proje.oySayisi || 0) + 1;
    const yeniToplamOy = (proje.toplamOy || 0) + oy;
    const yeniOrtalamaOy = yeniToplamOy / yeniOySayisi;

    await Proje.findByIdAndUpdate(projeId, {
      oySayisi: yeniOySayisi,
      toplamOy: yeniToplamOy,
      ortalamaOy: yeniOrtalamaOy
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

    console.log('Moderation parametreleri:', { durum, tur, kategori, sayfa, limit });

    let projeFilter = {};
    let fikirFilter = {};

    // Durum filtresi
    if (durum && durum !== 'Tümü') {
      projeFilter.durum = durum;
      fikirFilter.durum = durum;
    }

    // Kategori filtresi
    if (kategori && kategori !== 'Tümü') {
      projeFilter.kategori = kategori;
      fikirFilter.kategori = kategori;
    }

    // Tür filtresi
    if (tur && tur !== 'Tümü') {
      if (tur === 'proje') {
        projeFilter.tur = 'proje';
      } else if (tur === 'fikir') {
        projeFilter.tur = 'fikir';
      }
    }

    console.log('Proje filtresi:', projeFilter);
    console.log('Fikir filtresi:', fikirFilter);

    // Projeleri getir
    const projeler = await Proje.find(projeFilter)
      .sort({ createdAt: -1 })
      .exec();

    // Fikirleri getir (Idea modelinden)
    const fikirler = await Idea.find(fikirFilter)
      .sort({ createdAt: -1 })
      .exec();

    console.log('Bulunan projeler:', projeler.length);
    console.log('Bulunan fikirler:', fikirler.length);
    console.log('Fikir örnekleri:', fikirler.map(f => ({ id: f._id, baslik: f.baslik, durum: f.durum })));

    // Projeler ve fikirleri birleştir
    let tumBasvurular = [
      ...projeler.map(p => ({ ...p.toObject(), tip: 'proje' })),
      ...fikirler.map(f => ({ ...f.toObject(), tip: 'fikir' }))
    ];

    // Tarihe göre sırala
    tumBasvurular.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Sayfalama uygula
    const toplam = tumBasvurular.length;
    const baslangic = (sayfa - 1) * limit;
    const bitis = baslangic + limit;
    const sayfalanmisBasvurular = tumBasvurular.slice(baslangic, bitis);

    console.log('Toplam başvuru sayısı:', toplam);
    console.log('Proje sayısı:', projeler.length);
    console.log('Fikir sayısı:', fikirler.length);
    console.log('Birleştirilmiş başvurular:', sayfalanmisBasvurular.map(b => ({ id: b._id, baslik: b.baslik, tip: b.tip })));

    res.json({
      success: true,
      data: {
        projeler: sayfalanmisBasvurular,
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

    console.log('Gelen parametreler:', { kategori, siralama, sayfa, limit });

    let filter = { durum: 'Onaylandı', aktif: true };
    if (kategori && kategori !== 'Tümü') filter.kategori = kategori;

    console.log('Filtre:', filter);

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

    console.log('Sıralama:', sort);

    const projeler = await Proje.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((sayfa - 1) * limit)
      .exec();

    console.log('Bulunan proje sayısı:', projeler.length);
    console.log('Projeler:', projeler.map(p => ({ 
      baslik: p.baslik, 
      oySayisi: p.oySayisi, 
      ortalamaOy: p.ortalamaOy,
      createdAt: p.createdAt 
    })));

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

// @desc    Test endpoint - Tüm fikirleri getir
// @route   GET /api/test/fikirler
// @access  Public
const testFikirlerGetir = async (req, res) => {
  try {
    const fikirler = await Idea.find({});
    console.log('Test: Tüm fikirler:', fikirler.length);
    console.log('Test: Fikir detayları:', fikirler.map(f => ({ id: f._id, baslik: f.baslik, durum: f.durum })));
    
    res.json({
      success: true,
      data: {
        fikirler,
        toplam: fikirler.length
      }
    });
  } catch (error) {
    console.error('Test fikirler getirilirken hata:', error);
    res.status(500).json({
      success: false,
      message: 'Test fikirler getirilirken hata oluştu',
      error: error.message
    });
  }
};

module.exports = {
  tumProjeleriGetir,
  projeGetir,
  projeOlustur,
  fikirOlustur,
  projeGuncelle,
  projeSil,
  kategoriIstatistikleri,
  oyVer,
  basvuruTakipGetir,
  moderationBasvurularGetir,
  basvuruDurumGuncelle,
  oylamaProjeleriGetir,
  testFikirlerGetir
}; 