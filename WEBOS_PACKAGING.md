# LG webOS 3.0-3.5 Packaging Guide

## Overview

Bu rehber, IPTV player uygulamasını LG webOS 3.0-3.5 cihazları için nasıl paketleyeceğinizi anlatır.

---

## Gereksinimler

### 1. webOS TV SDK Kurulumu

\`\`\`bash
# webOS TV SDK CLI yükle
npm install -g @webosose/ares-cli

# Kurulumu kontrol et
ares --version
\`\`\`

### 2. Developer Mode Aktivasyonu

LG TV'nizde:
1. **Ayarlar** → **Genel** → **Developer Mode** → **Açık**
2. TV'nin IP adresini not edin
3. Developer Mode App'i açın ve "Dev Mode Status: ON" göründüğünden emin olun

---

## Proje Yapısı

webOS app yapısı:

\`\`\`
iptv-player/
├── appinfo.json          # App metadata
├── icon.png              # App icon (80x80)
├── largeIcon.png         # Large icon (130x130)
├── public/
│   ├── index.html        # Ana HTML
│   ├── app.js            # Ana JS
│   ├── components.js     # React components
│   ├── data.js           # Data
│   ├── api-helper.js     # API helper
│   ├── storage-helper.js # Storage helper
│   ├── license-screen.js # License screen
│   ├── expired-screen.js # Expired screen
│   ├── polyfills.js      # ES5 polyfills
│   ├── styles.css        # CSS
│   └── images/           # Resimler
└── README.md
\`\`\`

---

## appinfo.json Oluşturma

`appinfo.json` dosyası oluşturun (root dizinde):

\`\`\`json
{
  "id": "com.aryatv.iptvplayer",
  "version": "1.0.0",
  "vendor": "AryaTV",
  "type": "web",
  "main": "public/index.html",
  "title": "IPTV Player",
  "icon": "icon.png",
  "largeIcon": "largeIcon.png",
  "appDescription": "Professional IPTV Player for webOS",
  "resolution": "1920x1080",
  "BGColor": "#1a1a1a",
  "requiredPermissions": [
    "network",
    "storage"
  ]
}
\`\`\`

---

## Icon Hazırlama

### icon.png (80x80)

\`\`\`bash
# ImageMagick ile resize
convert logo.png -resize 80x80 icon.png
\`\`\`

### largeIcon.png (130x130)

\`\`\`bash
convert logo.png -resize 130x130 largeIcon.png
\`\`\`

---

## Frontend API URL Güncelleme

`public/api-helper.js` dosyasında production URL'i ayarlayın:

\`\`\`javascript
var API_BASE_URL = 'https://api.aryatv.live'; // Production backend URL
\`\`\`

---

## Paketleme

### 1. IPK Dosyası Oluşturma

\`\`\`bash
# Proje dizininde
ares-package . --outdir ./build

# Output: build/com.aryatv.iptvplayer_1.0.0_all.ipk
\`\`\`

### 2. TV'ye Cihaz Ekleme

\`\`\`bash
# TV'yi ekle (sadece bir kez)
ares-setup-device

# İsim: webos-tv
# IP: [TV'nizin IP adresi]
# Port: 9922
# Username: prisoner
# Password: [boş bırakın, şifre sorulduğunda Enter'a basın]
\`\`\`

### 3. TV'ye Kurulum

\`\`\`bash
# IPK dosyasını TV'ye yükle
ares-install --device webos-tv ./build/com.aryatv.iptvplayer_1.0.0_all.ipk
\`\`\`

### 4. Uygulamayı Başlatma

\`\`\`bash
# TV'de uygulamayı çalıştır
ares-launch --device webos-tv com.aryatv.iptvplayer
\`\`\`

### 5. Uygulamayı Kapatma

\`\`\`bash
ares-close --device webos-tv com.aryatv.iptvplayer
\`\`\`

### 6. Uygulamayı Kaldırma

\`\`\`bash
ares-uninstall --device webos-tv com.aryatv.iptvplayer
\`\`\`

---

## Debug ve Log

### Realtime Logs

\`\`\`bash
# TV'deki console.log mesajlarını görüntüle
ares-inspect --device webos-tv com.aryatv.iptvplayer

# Browser açılır: Chrome DevTools
# Console tab'de [v0] mesajlarını görebilirsiniz
\`\`\`

### Log Dosyaları

\`\`\`bash
# TV'den log dosyalarını çek
ares-device -d webos-tv --log
\`\`\`

---

## Testing

### 1. Network Bağlantısı Test

\`\`\`javascript
// api-helper.js'de console.log eklendi:
console.log('[v0] API Request:', method, url);
console.log('[v0] API Response:', response);
\`\`\`

### 2. Remote Control Test

\`\`\`javascript
// app.js'de key events loglanıyor:
console.log('[v0] Key pressed:', keyCode);
\`\`\`

### 3. Storage Test

\`\`\`javascript
// storage-helper.js'de storage operations loglanıyor:
console.log('[v0] Storage read:', key, value);
console.log('[v0] Storage write:', key, value);
\`\`\`

---

## Sorun Giderme

### 1. "Device not found" Hatası

\`\`\`bash
# TV'nin developer mode aktif olduğundan emin olun
# TV ve bilgisayar aynı network'te olmalı
ares-setup-device
\`\`\`

### 2. "Installation failed" Hatası

\`\`\`bash
# appinfo.json syntax hatası olabilir
# icon.png ve largeIcon.png dosyaları eksik olabilir
cat appinfo.json | jq  # JSON validation
\`\`\`

### 3. "White screen" veya "App crashes"

\`\`\`bash
# Chrome DevTools ile debug edin
ares-inspect --device webos-tv com.aryatv.iptvplayer

# Console'da JavaScript hataları görünür
\`\`\`

### 4. API Bağlantı Hatası (CORS)

- Backend CORS headers kontrol edin
- HTTPS kullandığınızdan emin olun
- TV'nin internet bağlantısını kontrol edin

### 5. Video Oynatma Sorunu

- HLS.js 0.7.11 kullanıldığından emin olun
- Stream URL'in HTTPS olduğundan emin olun
- Codec uyumluluğunu kontrol edin (H.264, AAC)

---

## Production Deployment

### LG Content Store'a Yükleme

1. **LG Seller Lounge Hesabı**
   - https://seller.lgappstv.com
   - Developer hesabı oluşturun

2. **App Submission**
   - IPK dosyasını yükleyin
   - Screenshots ekleyin
   - App açıklaması yazın
   - Kategori seçin: Video

3. **Review Process**
   - LG review süreci 5-10 gün sürer
   - Onaylandıktan sonra tüm LG TV'lerde görünür

### USB ile Yükleme (Offline)

\`\`\`bash
# IPK dosyasını USB'ye kopyala
cp build/com.aryatv.iptvplayer_1.0.0_all.ipk /Volumes/USB/

# TV'de:
# Developer Mode App → Install from USB
\`\`\`

---

## Güncelleme (Update)

Version numarasını artırın:

\`\`\`json
{
  "version": "1.1.0"
}
\`\`\`

Yeniden paketleyin ve yükleyin:

\`\`\`bash
ares-package . --outdir ./build
ares-install --device webos-tv ./build/com.aryatv.iptvplayer_1.1.0_all.ipk
\`\`\`

---

## Best Practices

1. **Performance**
   - Resimleri optimize edin (max 200KB)
   - JavaScript bundle'ı minimize edin
   - Memory leak kontrolü yapın

2. **Compatibility**
   - webOS 3.0, 3.5, 4.0, 5.0 test edin
   - Farklı ekran çözünürlüklerini test edin (1080p, 4K)

3. **User Experience**
   - Remote control navigation çalıştığından emin olun
   - Loading states gösterin
   - Error messages açık olsun

4. **Security**
   - HTTPS kullanın
   - API keys'i hardcode etmeyin
   - Input validation yapın

---

## Support

- webOS Forum: https://forum.developer.lge.com
- webOS Docs: https://webostv.developer.lge.com
- AryaTV Support: support@aryatv.live
