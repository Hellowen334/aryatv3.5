# IPTV Player for LG webOS 3.0-3.5

Professional IPTV player with license system for LG webOS 3.0-3.5 smart TVs (2015-2017 era).

## Features

- ✅ **7-Day Demo Period** - Try before you buy
- ✅ **Custom Playlist Support** - Upload your own M3U playlists
- ✅ **Live TV, Movies, Series** - Full content categories
- ✅ **Remote Control Navigation** - Optimized for TV remotes
- ✅ **HLS Streaming** - Compatible with webOS 3.5
- ✅ **Secure License System** - MAC-based device authentication
- ✅ **Modern UI** - Netflix-style interface

## Architecture

### Frontend (TV Client)
- **Tech Stack**: HTML5, ES5 JavaScript, React 16
- **Compatibility**: Chromium 38 (webOS 3.0-3.5)
- **Video**: HLS.js 0.7.11
- **Storage**: localStorage for device info

### Backend (License API)
- **Tech Stack**: Node.js, Express, MongoDB
- **Deployment**: Vercel/Render/VPS
- **API**: RESTful JSON API with CORS for old browsers

## Quick Start

### 1. Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
\`\`\`

See [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md) for production deployment.

### 2. Frontend Setup

\`\`\`bash
# Update API URL in public/api-helper.js
var API_BASE_URL = 'https://api.aryatv.live';

# Open public/index.html in browser for testing
\`\`\`

### 3. webOS Packaging

\`\`\`bash
# Install webOS CLI
npm install -g @webosose/ares-cli

# Package app
ares-package . --outdir ./build

# Install on TV
ares-install --device webos-tv ./build/com.aryatv.iptvplayer_1.0.0_all.ipk
\`\`\`

See [WEBOS_PACKAGING.md](WEBOS_PACKAGING.md) for detailed instructions.

## How It Works

### First Install Flow

1. App opens → Shows license screen
2. Generates MAC address (permanent)
3. Registers with backend → Gets security code
4. User can choose:
   - **DEMO**: 7-day free trial with demo playlist
   - **RELOAD LIST**: Load custom playlist from www.aryatv.live

### Demo Period

- Duration: 7 days (168 hours)
- Playlist: Public IPTV channels
- After expiry: Shows expired screen with instructions

### Custom Playlist

1. User visits **www.aryatv.live**
2. Enters MAC address and security code
3. Uploads M3U playlist URL
4. Presses "RELOAD LIST" button on TV
5. App loads custom playlist

## File Structure

\`\`\`
iptv-player/
├── public/                    # Frontend files (webOS compatible)
│   ├── index.html            # Main HTML
│   ├── app.js                # Main app logic
│   ├── components.js         # React components
│   ├── api-helper.js         # API communication
│   ├── storage-helper.js     # Local storage
│   ├── license-screen.js     # License activation screen
│   ├── expired-screen.js     # Demo expired screen
│   ├── polyfills.js          # ES5 polyfills
│   ├── styles.css            # CSS (no CSS variables)
│   └── data.js               # Sample data
├── backend/                   # Backend API
│   ├── server.js             # Express server
│   ├── package.json          # Dependencies
│   ├── .env.example          # Environment template
│   ├── DEPLOYMENT.md         # Deployment guide
│   └── API.md                # API documentation
├── appinfo.json              # webOS app metadata
├── icon.png                  # App icon (80x80)
├── largeIcon.png             # Large icon (130x130)
├── WEBOS_PACKAGING.md        # webOS packaging guide
└── README.md                 # This file
\`\`\`

## Browser Compatibility

### Supported
- ✅ LG webOS 3.0 (2016)
- ✅ LG webOS 3.5 (2017)
- ✅ LG webOS 4.0+ (newer models)
- ✅ Modern browsers (Chrome, Firefox, Safari)

### Not Supported
- ❌ webOS 2.x and older
- ❌ Internet Explorer 11

## Development

### Local Testing

\`\`\`bash
# Open in browser
open public/index.html

# Or use local server
python3 -m http.server 8000
# Visit http://localhost:8000/public/
\`\`\`

### Debug on TV

\`\`\`bash
# Real-time logs
ares-inspect --device webos-tv com.aryatv.iptvplayer

# Chrome DevTools opens → See console.log messages
\`\`\`

### Remote Control Testing

Key mappings:
- **Arrow Keys**: Navigation (Up/Down/Left/Right)
- **Enter/OK**: Select
- **Back**: Go back
- **Exit**: Close app

## API Endpoints

See [backend/API.md](backend/API.md) for full API documentation.

Key endpoints:
- `POST /api/device/register` - Register device
- `POST /api/device/activate-demo` - Activate 7-day demo
- `POST /api/device/check-license` - Check license status
- `POST /api/device/upload-playlist` - Upload custom playlist

## Troubleshooting

### White Screen on TV

\`\`\`bash
# Check console for errors
ares-inspect --device webos-tv com.aryatv.iptvplayer

# Common issues:
# - JavaScript syntax errors (use ES5 only)
# - Missing polyfills
# - CORS errors
\`\`\`

### API Connection Failed

- Check backend is running
- Verify API_BASE_URL in api-helper.js
- Check CORS headers on backend
- Ensure HTTPS for production

### Demo Not Activating

- Check backend logs
- Verify MongoDB connection
- Check MAC address format
- Verify security code matches

### Video Not Playing

- Check stream URL (must be HTTPS)
- Verify HLS.js 0.7.11 is loaded
- Check codec compatibility (H.264, AAC)
- Test with: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

## License

MIT License - See LICENSE file

## Support

- Email: support@aryatv.live
- Website: www.aryatv.live
- GitHub Issues: [Create Issue]

## Credits

- Built for LG webOS 3.0-3.5 compatibility
- React 16.14.0 (last ES5-compatible version)
- HLS.js 0.7.11 (webOS 3.5 compatible)
- Icons: Lucide Icons

---

Made with ❤️ for LG Smart TV users
