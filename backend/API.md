# IPTV License API Documentation

## Base URL

\`\`\`
Production: https://api.aryatv.live
Development: http://localhost:3000
\`\`\`

---

## Endpoints

### 1. Health Check

**GET** `/health`

Server durumunu kontrol eder.

#### Response

\`\`\`json
{
  "status": "ok",
  "service": "IPTV License API"
}
\`\`\`

---

### 2. Register Device

**POST** `/api/device/register`

Yeni bir cihazı kayıt eder veya mevcut cihaz bilgilerini getirir.

#### Request Body

\`\`\`json
{
  "mac": "00:1A:2B:3C:4D:5E"
}
\`\`\`

#### Response (Yeni Cihaz)

\`\`\`json
{
  "success": true,
  "device": {
    "mac": "00:1A:2B:3C:4D:5E",
    "securityCode": "ABC12345",
    "installDate": "2025-01-10T10:30:00.000Z",
    "demoUsed": false,
    "demoValid": false,
    "hasCustomPlaylist": false
  }
}
\`\`\`

#### Response (Mevcut Cihaz)

\`\`\`json
{
  "success": true,
  "device": {
    "mac": "00:1A:2B:3C:4D:5E",
    "securityCode": "ABC12345",
    "installDate": "2025-01-05T08:20:00.000Z",
    "demoUsed": true,
    "demoValid": true,
    "hasCustomPlaylist": false
  }
}
\`\`\`

---

### 3. Activate Demo

**POST** `/api/device/activate-demo`

7 günlük demo lisansını aktif eder.

#### Request Body

\`\`\`json
{
  "mac": "00:1A:2B:3C:4D:5E",
  "securityCode": "ABC12345"
}
\`\`\`

#### Response (Başarılı)

\`\`\`json
{
  "success": true,
  "message": "Demo activated successfully",
  "demoEndDate": "2025-01-17T10:30:00.000Z",
  "playlistURL": "https://iptv-org.github.io/iptv/index.m3u"
}
\`\`\`

#### Response (Demo Zaten Aktif)

\`\`\`json
{
  "success": true,
  "message": "Demo already activated",
  "demoEndDate": "2025-01-17T10:30:00.000Z",
  "playlistURL": "https://iptv-org.github.io/iptv/index.m3u"
}
\`\`\`

#### Response (Demo Süresi Dolmuş)

\`\`\`json
{
  "success": false,
  "error": "Demo period has expired",
  "demoExpired": true
}
\`\`\`

---

### 4. Check License

**POST** `/api/device/check-license`

Cihazın lisans durumunu kontrol eder.

#### Request Body

\`\`\`json
{
  "mac": "00:1A:2B:3C:4D:5E",
  "securityCode": "ABC12345"
}
\`\`\`

#### Response (Custom Playlist Var)

\`\`\`json
{
  "success": true,
  "demoUsed": true,
  "demoValid": false,
  "demoExpired": true,
  "hasCustomPlaylist": true,
  "playlistURL": "https://example.com/my-playlist.m3u"
}
\`\`\`

#### Response (Demo Aktif)

\`\`\`json
{
  "success": true,
  "demoUsed": true,
  "demoValid": true,
  "demoExpired": false,
  "hasCustomPlaylist": false,
  "playlistURL": "https://iptv-org.github.io/iptv/index.m3u",
  "demoEndDate": "2025-01-17T10:30:00.000Z"
}
\`\`\`

#### Response (Lisans Yok)

\`\`\`json
{
  "success": true,
  "demoUsed": false,
  "demoValid": false,
  "demoExpired": false,
  "hasCustomPlaylist": false,
  "playlistURL": null
}
\`\`\`

---

### 5. Upload Custom Playlist

**POST** `/api/device/upload-playlist`

Kullanıcının özel playlist'ini yükler (www.aryatv.live üzerinden).

#### Request Body

\`\`\`json
{
  "mac": "00:1A:2B:3C:4D:5E",
  "securityCode": "ABC12345",
  "playlistURL": "https://example.com/my-playlist.m3u"
}
\`\`\`

#### Response

\`\`\`json
{
  "success": true,
  "message": "Playlist uploaded successfully"
}
\`\`\`

---

### 6. Get Device Info

**GET** `/api/device/:mac`

Cihaz bilgilerini getirir (admin dashboard için).

#### Response

\`\`\`json
{
  "success": true,
  "device": {
    "mac": "00:1A:2B:3C:4D:5E",
    "securityCode": "ABC12345",
    "installDate": "2025-01-05T08:20:00.000Z",
    "demoUsed": true,
    "demoValid": false,
    "demoEndDate": "2025-01-12T08:20:00.000Z",
    "hasCustomPlaylist": true,
    "lastAccessDate": "2025-01-10T14:25:00.000Z"
  }
}
\`\`\`

---

## Error Responses

### 400 Bad Request

\`\`\`json
{
  "error": "MAC address required"
}
\`\`\`

### 404 Not Found

\`\`\`json
{
  "error": "Device not found or invalid security code"
}
\`\`\`

### 500 Internal Server Error

\`\`\`json
{
  "error": "Database error"
}
\`\`\`

---

## Frontend Flow

### İlk Kurulum (First Install)

1. Uygulama açılır
2. MAC address oluşturulur (veya mevcut okunur)
3. `POST /api/device/register` → Security code alınır
4. Lisans ekranı gösterilir

### Demo Aktivasyonu

1. Kullanıcı "DEMO" butonuna basar
2. `POST /api/device/activate-demo`
3. Demo playlist URL alınır
4. Ana ekrana geçilir

### Playlist Yükleme

1. Kullanıcı www.aryatv.live'a gider
2. MAC + Security Code + Playlist URL girer
3. Backend'e `POST /api/device/upload-playlist` gönderilir
4. TV'de "RELOAD LIST" butonuna basılır
5. `POST /api/device/check-license` → Custom playlist URL alınır
6. Ana ekrana geçilir

### Uygulama Açılışında

1. `POST /api/device/check-license`
2. Custom playlist varsa → Ana ekran
3. Demo validse → Ana ekran
4. Demo expiredse → Expired ekran
5. Hiçbiri yoksa → Lisans ekran

---

## Rate Limiting (Production)

Production'da rate limiting eklenmeli:

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // 100 request per 15 min
});

app.use('/api/', limiter);
\`\`\`

---

## Security Notes

1. **MAC Address Validation**: MAC format kontrolü yapılmalı
2. **Security Code**: 8 karakterli alfanumerik kod
3. **HTTPS**: Production'da mutlaka HTTPS
4. **Input Sanitization**: Tüm input'lar sanitize ediliyor
5. **CORS**: Eski TV'ler için wildcard (`*`) gerekli
