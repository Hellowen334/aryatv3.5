# webOS 3.0-3.5 İçin Derleme ve Kurulum Rehberi

## Gereksinimler

1. **LG webOS TV SDK 3.5** (2015-2017 cihazlar için)
2. **Node.js 8.x** veya daha eski (SDK uyumluluğu için)
3. **webOS TV CLI** kurulu olmalı

## Proje Yapısı

\`\`\`
iptv-player-webos/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── polyfills.js
│   ├── data.js
│   ├── components.js
│   └── app.js
├── appinfo.json
└── icon.png
\`\`\`

## appinfo.json Oluşturma

webOS paketi için aşağıdaki dosyayı oluşturun:

\`\`\`json
{
  "id": "com.yourcompany.iptvplayer",
  "version": "1.0.0",
  "vendor": "Your Company",
  "type": "web",
  "main": "index.html",
  "title": "IPTV Player",
  "icon": "icon.png",
  "largeIcon": "icon.png",
  "requiredMemory": 100,
  "resolution": "1920x1080",
  "disallowScrollingInMainWindow": true,
  "v8SnapshotFile": "",
  "usePrerendering": false,
  "noWindow": false
}
\`\`\`

## Derleme Adımları

### 1. Proje Paketleme

\`\`\`bash
# webOS CLI ile paket oluştur
ares-package ./iptv-player-webos -o ./builds/

# Çıktı: com.yourcompany.iptvplayer_1.0.0_all.ipk
\`\`\`

### 2. Cihaza Kurulum

\`\`\`bash
# TV'yi kaydet (ilk kez)
ares-setup-device

# Uygulamayı kur
ares-install --device YOUR_TV_NAME ./builds/com.yourcompany.iptvplayer_1.0.0_all.ipk

# Uygulamayı çalıştır
ares-launch --device YOUR_TV_NAME com.yourcompany.iptvplayer
\`\`\`

### 3. Debugging

\`\`\`bash
# Web Inspector açmak için
ares-inspect --device YOUR_TV_NAME --app com.yourcompany.iptvplayer --open
\`\`\`

## Önemli Notlar

### CORS Problemleri

webOS 3.5 cihazlar eski Chromium kullandığı için CORS çok katıdır. Sunucu tarafında şu header'lar ZORUNLU:

\`\`\`
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: *
\`\`\`

### HLS Stream Gereksinimleri

1. **HTTPS zorunlu** - Self-signed sertifikalar ÇALIŞMAZ
2. **HLS.js 0.7.11** kullanın (daha yeni versiyonlar webOS 3.5'te çalışmaz)
3. **Codec desteği:**
   - Video: H.264 (Main/High profile)
   - Audio: AAC-LC
4. **Segment boyutları:** 2-6 saniye önerilir

### Performans Optimizasyonu

1. **Bundle boyutu:** Toplam JS < 2MB tutun
2. **Görsel optimizasyonu:** Thumbnail'ler max 400x600px
3. **Memory leaks:** `componentWillUnmount`'da tüm event listener'ları temizleyin
4. **Video memory:** Aynı anda sadece 1 video instance tutun

### Test Edilmesi Gereken Senaryolar

- [ ] Remote control ile tüm navigasyon
- [ ] HLS stream başlatma ve durdurma
- [ ] Ağ bağlantısı kesilmesi
- [ ] Uzun süre (2-3 saat) açık kalma - memory leak kontrolü
- [ ] 4K TV'lerde görüntü kalitesi
- [ ] Kategori değiştirme performansı

### Bilinen Sorunlar ve Çözümleri

**Siyah ekran (video oynatılmıyor):**
- HLS stream URL'ini kontrol edin
- CORS header'ları kontrol edin
- SSL sertifikası geçerli mi kontrol edin
- Console'da HLS.js error loglarını inceleyin

**Remote control tepki vermiyor:**
- `keyCode` değerlerini console'da kontrol edin
- LG TV'lerde bazı keycode'lar farklı olabilir
- `e.preventDefault()` çağrıldığından emin olun

**CSS render sorunları:**
- CSS variables kullanmayın
- Flexbox eski syntax kullanın
- CSS Grid YOK
- Animasyonları minimal tutun

## Üretim Hazırlığı

1. **SSL:** Geçerli CA'dan alınmış sertifika kullanın
2. **CDN:** Static dosyaları CDN'e taşıyın
3. **Caching:** Thumbnail'lere `Cache-Control` header'ı ekleyin
4. **Analytics:** XMLHttpRequest ile basit event tracking ekleyin
5. **Error reporting:** Console log'larını toplamak için endpoint ekleyin

## webOS Store Yükleme

1. LG Seller Lounge'a kayıt olun
2. `.ipk` dosyasını yükleyin
3. Test cihazlarında onay alın
4. Sertifikasyon sürecini tamamlayın (2-4 hafta)

## Destek ve Kaynaklar

- [LG webOS TV Developer Site](https://webostv.developer.lge.com/)
- [webOS TV SDK Forum](https://forum.developer.lge.com/)
- [HLS.js 0.7.x Documentation](https://github.com/video-dev/hls.js/tree/v0.7.11)
