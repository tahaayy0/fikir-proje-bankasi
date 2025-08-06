# Fikir Proje Bankası

Bu proje, fikir ve projelerin paylaşılabileceği bir platformdur.

## Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- Docker ve Docker Compose
- MongoDB Atlas hesabı

### Environment Variables

1. `backend/env.example` dosyasını `backend/.env` olarak kopyalayın
2. MongoDB Atlas'tan connection string alın ve `MONGO_URI` değişkenini güncelleyin

```bash
cp backend/env.example backend/.env
```

`.env` dosyasını düzenleyin:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

### Docker ile Çalıştırma

```bash
# Environment variable'ı set edin
export MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/database_name"

# Docker Compose ile başlatın
docker-compose up --build
```

### Manuel Çalıştırma

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd web
npm install
npm start
```

## API Endpoints

- `GET /api/projeler` - Tüm projeleri listele
- `POST /api/projeler` - Yeni proje oluştur
- `GET /api/projeler/:id` - Tek proje getir
- `PUT /api/projeler/:id` - Proje güncelle
- `DELETE /api/projeler/:id` - Proje sil

## Veritabanı

Proje MongoDB Atlas kullanmaktadır. Hem Docker hem de Render deployment'ı aynı MongoDB Atlas veritabanını kullanır.

## Deployment

### Render
Render'da otomatik deployment için `render.yaml` dosyası kullanılır.

### Docker
Local development için Docker Compose kullanılır.
