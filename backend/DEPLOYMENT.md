# IPTV License Backend - Deployment Guide

## Overview

Bu backend API, LG webOS 3.0-3.5 cihazları için lisans yönetimi sağlar. Node.js + Express + MongoDB kullanır.

---

## Gereksinimler

- Node.js 12+ 
- MongoDB database (lokal veya cloud)
- HTTPS sertifikası (production için)

---

## Lokal Geliştirme

### 1. Bağımlılıkları Yükle

\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Environment Variables Ayarla

`.env` dosyası oluştur:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/iptv_licenses
PORT=3000
\`\`\`

### 3. MongoDB'yi Başlat

\`\`\`bash
# macOS/Linux
mongod

# veya Docker ile
docker run -d -p 27017:27017 mongo:5
\`\`\`

### 4. Sunucuyu Başlat

\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

Server `http://localhost:3000` adresinde çalışacak.

---

## Production Deployment

### Seçenek 1: Vercel Deployment (Önerilen)

Vercel, serverless functions ile MongoDB Atlas kombinasyonu kullanır.

#### Adımlar:

1. **MongoDB Atlas Hesabı Oluştur**
   - https://www.mongodb.com/cloud/atlas
   - Ücretsiz cluster oluştur
   - Database kullanıcısı ve şifre ayarla
   - IP whitelist'e `0.0.0.0/0` ekle (tüm IP'lere izin)

2. **Vercel'e Deploy Et**

\`\`\`bash
npm install -g vercel
cd backend
vercel
\`\`\`

3. **Environment Variables Ekle**

Vercel dashboard'dan:
- `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/iptv_licenses`

4. **CORS Ayarları**

`vercel.json` dosyası zaten yapılandırılmış:

\`\`\`json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "*" }
      ]
    }
  ]
}
\`\`\`

### Seçenek 2: Render Deployment

1. **Render'da Web Service Oluştur**
   - https://render.com
   - "New Web Service" → GitHub repo bağla
   - Build Command: `npm install`
   - Start Command: `node server.js`

2. **MongoDB Atlas Bağla**
   - Environment variables ekle:
     - `MONGODB_URI` = MongoDB Atlas connection string
     - `PORT` = 10000 (Render otomatik ayarlar)

### Seçenek 3: Railway Deployment

\`\`\`bash
npm install -g @railway/cli
railway login
railway init
railway up
\`\`\`

Environment variables ekle:
- `MONGODB_URI`

### Seçenek 4: VPS (DigitalOcean, AWS, Linode)

\`\`\`bash
# SSH ile sunucuya bağlan
ssh root@your-server-ip

# Node.js ve MongoDB yükle
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# Projeyi klonla
git clone https://github.com/your-repo/iptv-backend.git
cd iptv-backend

# Bağımlılıkları yükle
npm install

# PM2 ile çalıştır (production)
npm install -g pm2
pm2 start server.js --name iptv-api
pm2 startup
pm2 save

# Nginx reverse proxy (HTTPS için)
sudo apt-get install nginx certbot python3-certbot-nginx

# Nginx config
sudo nano /etc/nginx/sites-available/iptv-api
\`\`\`

Nginx config örneği:

\`\`\`nginx
server {
    listen 80;
    server_name api.aryatv.live;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers for old LG TVs
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers *;
    }
}
\`\`\`

SSL sertifikası ekle:

\`\`\`bash
sudo certbot --nginx -d api.aryatv.live
\`\`\`

---

## API Endpoints Test

### 1. Health Check

\`\`\`bash
curl https://api.aryatv.live/health
\`\`\`

### 2. Device Registration

\`\`\`bash
curl -X POST https://api.aryatv.live/api/device/register \
  -H "Content-Type: application/json" \
  -d '{"mac":"00:1A:2B:3C:4D:5E"}'
\`\`\`

### 3. Activate Demo

\`\`\`bash
curl -X POST https://api.aryatv.live/api/device/activate-demo \
  -H "Content-Type: application/json" \
  -d '{"mac":"00:1A:2B:3C:4D:5E","securityCode":"ABC12345"}'
\`\`\`

### 4. Check License

\`\`\`bash
curl -X POST https://api.aryatv.live/api/device/check-license \
  -H "Content-Type: application/json" \
  -d '{"mac":"00:1A:2B:3C:4D:5E","securityCode":"ABC12345"}'
\`\`\`

---

## Frontend Integration

Frontend `public/api-helper.js` dosyasında API URL'i güncelle:

\`\`\`javascript
var API_BASE_URL = 'https://api.aryatv.live'; // Production URL
\`\`\`

---

## Monitoring

### Logs

\`\`\`bash
# PM2 ile
pm2 logs iptv-api

# Vercel'de
vercel logs

# Render'da
Dashboard > Logs tab
\`\`\`

### Database

MongoDB Atlas dashboard'dan:
- Bağlantı sayısı
- Depolama kullanımı
- Query performance

---

## Güvenlik Notları

1. **CORS**: Eski LG TV'ler için `Access-Control-Allow-Origin: *` gerekli
2. **Rate Limiting**: Production'da rate limiting ekleyin
3. **Input Validation**: Tüm API endpoint'lerde input validation mevcut
4. **HTTPS**: Production'da mutlaka HTTPS kullanın
5. **MongoDB**: MongoDB Atlas kullanıyorsanız IP whitelist ayarlayın

---

## Sorun Giderme

### webOS 3.5 CORS Hataları

Eğer TV'den API'ye istek atarken CORS hatası alıyorsanız:

1. Backend'de CORS headers kontrol edin
2. Nginx kullanıyorsanız, Nginx config'e CORS headers ekleyin
3. OPTIONS preflight requests için 200 OK dönün

### TLS/SSL Sorunları

Eski LG TV'ler yeni TLS versiyonlarını desteklemez:

1. Let's Encrypt kullanın (eski cihazlarla uyumlu)
2. TLS 1.0/1.1 desteğini açık tutun (güvenlik riski ama eski cihazlar için gerekli)

### MongoDB Connection Errors

\`\`\`bash
# Connection string'i kontrol edin
# MongoDB Atlas'ta IP whitelist'e 0.0.0.0/0 ekleyin
# Network policies kontrol edin
\`\`\`

---

## Support

Sorularınız için: support@aryatv.live
