# Fikir Proje Bankası

Bu proje, web (React) ve backend (Node.js/Express) olmak üzere iki ana bileşenden oluşuyor. MongoDB veritabanı kullanılarak proje yönetimi için kapsamlı bir API sağlar.

## 🚀 Özellikler

- **RESTful API**: Swagger dokümantasyonu ile tam API desteği
- **Proje Yönetimi**: CRUD işlemleri ile proje ekleme, düzenleme, silme
- **Filtreleme ve Arama**: Kategori, durum ve metin bazlı arama
- **İstatistikler**: Kategorilere göre proje istatistikleri
- **Docker Desteği**: Tam containerized yapı
- **MongoDB**: NoSQL veritabanı ile esnek veri yapısı

## 🛠️ Teknolojiler

- **Backend**: Node.js, Express.js, MongoDB (container içinde), Mongoose
- **Frontend**: React.js
- **Dokümantasyon**: Swagger/OpenAPI 3.0
- **Container**: Docker, Docker Compose (2 servis)
- **Validasyon**: Express Validator

## 📋 API Endpoints

### Projeler
- `GET /api/projeler` - Tüm projeleri listele
- `GET /api/projeler/:id` - ID ile proje getir
- `POST /api/projeler` - Yeni proje oluştur
- `PUT /api/projeler/:id` - Proje güncelle
- `DELETE /api/projeler/:id` - Proje sil (soft delete)
- `GET /api/projeler/istatistikler/kategori` - Kategori istatistikleri

### Sistem
- `GET /api/health` - Sistem sağlık kontrolü
- `GET /api/test` - API test endpoint'i

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Docker ve Docker Compose
- Node.js 18+ (geliştirme için)

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd fikir-proje-bankasi
```

### 2. Docker ile Çalıştırın
```bash
# Tüm servisleri başlat
docker-compose up --build

# Arka planda çalıştır
docker-compose up -d --build
```

### 3. Veritabanını Doldurun (İsteğe Bağlı)
```bash
# Örnek verileri ekle
docker-compose exec backend npm run seed
```

## 📖 API Dokümantasyonu

Swagger UI ile API dokümantasyonuna erişim:
- **Local**: http://localhost:5000/api-docs
- **Production**: https://fikir-proje-bankasi.onrender.com/api-docs

## 🔧 Geliştirme

### Backend Geliştirme
```bash
cd backend
npm install
npm run dev
```

### Veritabanı Seed
```bash
cd backend
npm run seed
```

## 📊 Proje Modeli

```javascript
{
  baslik: String,           // Proje başlığı (zorunlu)
  aciklama: String,         // Proje açıklaması (zorunlu)
  kategori: String,         // Teknoloji, Sağlık, Eğitim, Çevre, Sosyal, Diğer
  durum: String,           // Taslak, Aktif, Tamamlandı, İptal
  oncelik: String,         // Düşük, Orta, Yüksek, Kritik
  baslangicTarihi: Date,   // Proje başlangıç tarihi
  bitisTarihi: Date,       // Proje bitiş tarihi
  butce: Number,           // Proje bütçesi
  etiketler: [String],     // Proje etiketleri
  olusturanKisi: String,   // Oluşturan kişi (zorunlu)
  aktif: Boolean,          // Aktif durumu
  createdAt: Date,         // Oluşturulma tarihi
  updatedAt: Date          // Güncellenme tarihi
}
```

## 🌐 Servis URL'leri

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **MongoDB**: Backend container içinde (localhost:27017)
- **Swagger Docs**: http://localhost:5000/api-docs

## 📝 Örnek API Kullanımı

### Yeni Proje Oluştur
```bash
curl -X POST http://localhost:5000/api/projeler \
  -H "Content-Type: application/json" \
  -d '{
    "baslik": "Yeni Proje",
    "aciklama": "Proje açıklaması",
    "kategori": "Teknoloji",
    "durum": "Aktif",
    "oncelik": "Orta",
    "olusturanKisi": "John Doe"
  }'
```

### Projeleri Listele
```bash
curl http://localhost:5000/api/projeler
```

### Kategori Filtrele
```bash
curl "http://localhost:5000/api/projeler?kategori=Teknoloji"
```

## 🔍 Filtreleme ve Arama

API aşağıdaki query parametrelerini destekler:

- `sayfa`: Sayfa numarası (varsayılan: 1)
- `limit`: Sayfa başına kayıt sayısı (varsayılan: 10)
- `kategori`: Kategori filtresi
- `durum`: Durum filtresi
- `arama`: Başlık ve açıklamada metin arama

## 🐳 Docker Komutları

```bash
# Servisleri başlat
docker-compose up

# Arka planda çalıştır
docker-compose up -d

# Servisleri durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f

# Belirli servisin loglarını görüntüle
docker-compose logs -f backend
```

## 📁 Proje Yapısı

```
fikir-proje-bankasi/
├── backend/
│   ├── controllers/
│   │   └── projeController.js
│   ├── middleware/
│   │   └── validation.js
│   ├── models/
│   │   └── Proje.js
│   ├── routes/
│   │   └── projeler.js
│   ├── seed/
│   │   └── seedData.js
│   ├── Dockerfile (MongoDB dahil)
│   ├── index.js
│   └── package.json
├── web/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml (2 servis)
└── README.md
```

## 🐳 Docker Yapısı

- **Backend Container**: Node.js + MongoDB (tek container)
- **Web Container**: React.js
- **Veri Kalıcılığı**: MongoDB verileri volume ile saklanır

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Email**: destek@fikirprojebankasi.com
- **Proje Linki**: [https://github.com/username/fikir-proje-bankasi](https://github.com/username/fikir-proje-bankasi)
