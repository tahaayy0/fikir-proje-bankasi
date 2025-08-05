1️⃣ Proje Amacı ve Yapısı
Bu proje, web (React) ve backend (Node.js/Express) olmak üzere iki ana bileşenden oluşuyor.

Ortak Database: MongoDB kullanılıyor ve hem web hem backend aynı veritabanına bağlanıyor.

Admin Dashboard: React tabanlı admin arayüz entegre edilebilir.

Dockerized: Tüm yapı Docker container’ları üzerinde çalışıyor ve Docker Compose ile yönetiliyor.

CI/CD: Git branch yapısı (develop/main) ve Render deploy blueprint ile staging/production ortamları.

Proje dosya yapısı:

bash
Kopyala
Düzenle
project-root/
│
├── web/                  # Frontend (React)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── App.js
│
├── backend/              # Backend (Node.js/Express API)
│   ├── Dockerfile
│   ├── package.json
│   └── index.js
│
├── docker-compose.yml     # Docker blueprint (multi-container)
├── .env                   # Ortak environment (DB, JWT vb.)
└── README.md
2️⃣ Teknolojiler ve Rolleri
React (Web): Web portal UI ve admin dashboard.

Node.js (Backend): API endpoint’leri (Express ile REST servis).

MongoDB: Ortak veritabanı (user, admin data).

Docker & Compose: Tüm bileşenleri containerized yönetmek için.

Render: Prod deploy ortamı ve staging/test ortamları.

Git Workflow (Develop/Main): Profesyonel branch yönetimi ve CI/CD pipeline entegrasyonu.

3️⃣ .env Ortam Değişkenleri
Tek bir .env dosyası hem backend hem web tarafından kullanılır:

env
Kopyala
Düzenle
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://mongo:27017/myappdb
JWT_SECRET=supersecretkey
Local: MongoDB Compose içindeki container’dan çalışır.

Prod: Render MongoDB servisi veya Atlas Cluster URI kullanılır.

4️⃣ Backend (Node.js/Express)
Express server çalışır, API endpoint’leri (RESTful) sağlar.

MongoDB’ye Mongoose ile bağlanır.

Örnek endpoint:

javascript
Kopyala
Düzenle
app.get('/api/test', (req, res) => res.json({ message: 'Backend API is working!' }));
Auth, admin dashboard API, CRUD işlemleri buradan yürütülür.

backend/Dockerfile

dockerfile
Kopyala
Düzenle
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
5️⃣ Web (React - Admin Dashboard)
Web portalı ve admin dashboard React üzerinde.

API çağrılarını backend'e yapar.

React Admin, Ant Design veya Tailwind ile admin panel eklenebilir.

web/Dockerfile

dockerfile
Kopyala
Düzenle
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
6️⃣ Docker Compose (Multi-container)
Docker Compose hem web, backend hem de MongoDB’yi bir araya getirir:

docker-compose.yml

yaml
Kopyala
Düzenle
version: '3.9'
services:
  mongo:
    image: mongo:5
    container_name: mongo_container
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./backend
    container_name: backend_container
    ports:
      - "5000:5000"
    env_file: .env
    depends_on:
      - mongo

  web:
    build: ./web
    container_name: web_container
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo-data:
Çalıştırma:

bash
Kopyala
Düzenle
docker-compose up --build
Web: http://localhost:3000

API: http://localhost:5000/api/test

7️⃣ Git Workflow (Develop / Main)
Profesyonel olarak:

develop: Aktif geliştirme, local ve staging ortam testleri buradan.

main: Production’a giden stabilize kod.

Workflow:

develop üzerinde çalış.

Feature branch aç:

bash
Kopyala
Düzenle
git checkout develop
git checkout -b feature/admin-dashboard
PR ile develop merge et.

Release sonrası main’e merge edilir ve tag atılır.

8️⃣ Deploy (Render Üzerinden)
Render’da Docker Compose blueprint olarak deploy edilir.

İki ortam:

Staging: develop branch → test için.

Production: main branch → canlı ortam.

.env içeriği Render env vars olarak tanımlanır.

9️⃣ Test ve CI/CD
Local Docker Compose testleri ile feature’ları doğrula.

GitHub Actions CI pipeline:

Push sonrası build testleri.

Deploy otomasyonu Render API’si ile.