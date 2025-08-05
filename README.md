# Fikir Proje Bankası

Modern web teknolojileri ile geliştirilmiş proje yönetim platformu.

## 🚀 Teknolojiler

- **Frontend**: React 18, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Deployment**: Render

## 📁 Proje Yapısı

```
fikir-proje-bankasi/
├── web/                  # Frontend (React)
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend/              # Backend (Node.js/Express)
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker Compose
├── .env                  # Environment variables
└── README.md
```

## 🛠️ Kurulum

### Gereksinimler
- Docker & Docker Compose
- Node.js 18+ (geliştirme için)

### Hızlı Başlangıç

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd fikir-proje-bankasi
```

2. **Environment dosyasını oluşturun:**
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

3. **Docker ile başlatın:**
```bash
docker-compose up --build
```

4. **Uygulamaya erişin:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Test: http://localhost:5000/api/test

## 🔧 Geliştirme

### Backend Geliştirme
```bash
cd backend
npm install
npm run dev
```

### Frontend Geliştirme
```bash
cd web
npm install
npm start
```

### API Endpoints

- `GET /` - Ana sayfa
- `GET /api/test` - API test endpoint
- `GET /api/health` - Sistem durumu

## 🐳 Docker Komutları

```bash
# Tüm servisleri başlat
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

## 🌍 Environment Variables

`.env` dosyasında aşağıdaki değişkenleri tanımlayın:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://mongo:27017/myappdb
JWT_SECRET=supersecretkey
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Sistem Durumu

Uygulama başlatıldığında, frontend'de sistem durumu görüntülenir:
- ✅ Frontend durumu
- ✅ Backend API bağlantısı
- ✅ MongoDB bağlantısı

## 🔄 Git Workflow

- `develop` - Geliştirme branch'i
- `main` - Production branch'i

## 🚀 Deployment

### Render Deployment

1. Render'da yeni bir "Docker Compose" servisi oluşturun
2. GitHub repository'nizi bağlayın
3. Environment variables'ları ayarlayın
4. Deploy edin

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=5000
MONGO_URI=<production-mongodb-uri>
JWT_SECRET=<secure-jwt-secret>
REACT_APP_API_URL=<production-api-url>
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.
