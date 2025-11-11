// Backend API Server for IPTV License System
// Node.js + Express + MongoDB
// Compatible with old webOS 3.0-3.5 devices

var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

var app = express()
var PORT = process.env.PORT || 3000

// CORS configuration for old LG TVs (Chromium 38)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// MongoDB connection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/iptv_licenses"
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Device Schema
var deviceSchema = new mongoose.Schema({
  mac: { type: String, required: true, unique: true, index: true },
  securityCode: { type: String, required: true },
  installDate: { type: Date, default: Date.now },
  demoStartDate: { type: Date, default: null },
  demoEndDate: { type: Date, default: null },
  demoUsed: { type: Boolean, default: false },
  customPlaylistURL: { type: String, default: null },
  lastAccessDate: { type: Date, default: Date.now },
})

var Device = mongoose.model("Device", deviceSchema)

// Helper: Generate random security code
function generateSecurityCode() {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var code = ""
  for (var i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Helper: Check if demo is valid
function isDemoValid(device) {
  if (!device.demoUsed || !device.demoEndDate) {
    return false
  }
  var now = new Date()
  return now < device.demoEndDate
}

// API: Register/Get Device
app.post("/api/device/register", (req, res) => {
  var mac = req.body.mac

  if (!mac) {
    return res.status(400).json({ error: "MAC address required" })
  }

  Device.findOne({ mac: mac }, (err, device) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (device) {
      // Device exists, return existing data
      device.lastAccessDate = new Date()
      device.save()

      return res.json({
        success: true,
        device: {
          mac: device.mac,
          securityCode: device.securityCode,
          installDate: device.installDate,
          demoUsed: device.demoUsed,
          demoValid: isDemoValid(device),
          hasCustomPlaylist: !!device.customPlaylistURL,
        },
      })
    }

    // New device - create with random security code
    var securityCode = generateSecurityCode()
    var newDevice = new Device({
      mac: mac,
      securityCode: securityCode,
    })

    newDevice.save((err, savedDevice) => {
      if (err) {
        return res.status(500).json({ error: "Failed to register device" })
      }

      res.json({
        success: true,
        device: {
          mac: savedDevice.mac,
          securityCode: savedDevice.securityCode,
          installDate: savedDevice.installDate,
          demoUsed: false,
          demoValid: false,
          hasCustomPlaylist: false,
        },
      })
    })
  })
})

// API: Activate Demo (7 days)
app.post("/api/device/activate-demo", (req, res) => {
  var mac = req.body.mac
  var securityCode = req.body.securityCode

  if (!mac || !securityCode) {
    return res.status(400).json({ error: "MAC and security code required" })
  }

  Device.findOne({ mac: mac, securityCode: securityCode }, (err, device) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (!device) {
      return res.status(404).json({ error: "Device not found or invalid security code" })
    }

    if (device.demoUsed) {
      var demoStillValid = isDemoValid(device)

      if (!demoStillValid) {
        return res.json({
          success: false,
          error: "Demo period has expired",
          demoExpired: true,
        })
      }

      return res.json({
        success: true,
        message: "Demo already activated",
        demoEndDate: device.demoEndDate,
        playlistURL: "https://iptv-org.github.io/iptv/index.m3u", // Demo playlist
      })
    }

    // Activate demo for 7 days
    var now = new Date()
    var endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    device.demoUsed = true
    device.demoStartDate = now
    device.demoEndDate = endDate
    device.lastAccessDate = now

    device.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to activate demo" })
      }

      res.json({
        success: true,
        message: "Demo activated successfully",
        demoEndDate: endDate,
        playlistURL: "https://iptv-org.github.io/iptv/index.m3u", // Demo playlist
      })
    })
  })
})

// API: Check License Status
app.post("/api/device/check-license", (req, res) => {
  var mac = req.body.mac
  var securityCode = req.body.securityCode

  if (!mac || !securityCode) {
    return res.status(400).json({ error: "MAC and security code required" })
  }

  Device.findOne({ mac: mac, securityCode: securityCode }, (err, device) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (!device) {
      return res.status(404).json({ error: "Device not found" })
    }

    device.lastAccessDate = new Date()
    device.save()

    var response = {
      success: true,
      demoUsed: device.demoUsed,
      demoValid: false,
      demoExpired: false,
      hasCustomPlaylist: false,
      playlistURL: null,
    }

    // Check custom playlist first (priority)
    if (device.customPlaylistURL) {
      response.hasCustomPlaylist = true
      response.playlistURL = device.customPlaylistURL
      return res.json(response)
    }

    // Check demo status
    if (device.demoUsed) {
      var demoValid = isDemoValid(device)
      response.demoValid = demoValid
      response.demoExpired = !demoValid

      if (demoValid) {
        response.playlistURL = "https://iptv-org.github.io/iptv/index.m3u"
        response.demoEndDate = device.demoEndDate
      }
    }

    res.json(response)
  })
})

// API: Upload Custom Playlist (from website www.aryatv.live)
app.post("/api/device/upload-playlist", (req, res) => {
  var mac = req.body.mac
  var securityCode = req.body.securityCode
  var playlistURL = req.body.playlistURL

  if (!mac || !securityCode || !playlistURL) {
    return res.status(400).json({ error: "MAC, security code, and playlist URL required" })
  }

  Device.findOne({ mac: mac, securityCode: securityCode }, (err, device) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (!device) {
      return res.status(404).json({ error: "Device not found or invalid security code" })
    }

    device.customPlaylistURL = playlistURL
    device.lastAccessDate = new Date()

    device.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save playlist" })
      }

      res.json({
        success: true,
        message: "Playlist uploaded successfully",
      })
    })
  })
})

// API: Get Device Info (for website dashboard)
app.get("/api/device/:mac", (req, res) => {
  var mac = req.params.mac

  Device.findOne({ mac: mac }, (err, device) => {
    if (err) {
      return res.status(500).json({ error: "Database error" })
    }

    if (!device) {
      return res.status(404).json({ error: "Device not found" })
    }

    res.json({
      success: true,
      device: {
        mac: device.mac,
        securityCode: device.securityCode,
        installDate: device.installDate,
        demoUsed: device.demoUsed,
        demoValid: isDemoValid(device),
        demoEndDate: device.demoEndDate,
        hasCustomPlaylist: !!device.customPlaylistURL,
        lastAccessDate: device.lastAccessDate,
      },
    })
  })
})

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "IPTV License API" })
})

// Start server
app.listen(PORT, () => {
  console.log("IPTV License API running on port " + PORT)
})

module.exports = app
