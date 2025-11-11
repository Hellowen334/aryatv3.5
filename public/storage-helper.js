// Local Storage Helper for webOS 3.0-3.5 (ES5 only)
// Persistent storage for MAC address, security code, and license data

var StorageHelper = {
  // Storage keys
  KEYS: {
    MAC_ADDRESS: "iptv_mac_address",
    SECURITY_CODE: "iptv_security_code",
    DEVICE_REGISTERED: "iptv_device_registered",
    DEMO_ACTIVATED: "iptv_demo_activated",
    DEMO_END_DATE: "iptv_demo_end_date",
    PLAYLIST_URL: "iptv_playlist_url",
  },

  // Get item from localStorage
  getItem: (key) => {
    try {
      var value = localStorage.getItem(key)
      if (value === null) return null

      // Try to parse JSON
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    } catch (e) {
      console.log("[v0] Storage read error:", e)
      return null
    }
  },

  // Set item to localStorage
  setItem: (key, value) => {
    try {
      var stringValue = typeof value === "string" ? value : JSON.stringify(value)
      localStorage.setItem(key, stringValue)
      return true
    } catch (e) {
      console.log("[v0] Storage write error:", e)
      return false
    }
  },

  // Remove item from localStorage
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.log("[v0] Storage remove error:", e)
      return false
    }
  },

  // Generate MAC address (for webOS)
  generateMacAddress: function () {
    // Try to get real MAC from webOS API first
    if (window.webOS && window.webOS.deviceInfo) {
      try {
        // webOS specific API
        var info = window.webOS.deviceInfo()
        if (info && info.mac) {
          return info.mac.toUpperCase()
        }
      } catch (e) {
        console.log("[v0] webOS deviceInfo not available:", e)
      }
    }

    // Fallback: Generate pseudo-MAC based on browser fingerprint
    var nav = window.navigator
    var screen = window.screen
    var guid = nav.mimeTypes.length
    guid += nav.userAgent.replace(/\D+/g, "")
    guid += nav.plugins.length
    guid += screen.height || ""
    guid += screen.width || ""
    guid += screen.pixelDepth || ""

    // Create MAC-like format: XX:XX:XX:XX:XX:XX
    var hash = this.simpleHash(guid)
    var mac = ""
    for (var i = 0; i < 12; i++) {
      if (i > 0 && i % 2 === 0) mac += ":"
      mac += hash.charAt(i)
    }

    return mac.toUpperCase()
  },

  // Simple hash function for MAC generation
  simpleHash: function (str) {
    var hash = 0
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    var hex = Math.abs(hash).toString(16)
    while (hex.length < 12) {
      hex += Math.abs(this.simpleHash(hex + str)).toString(16)
    }
    return hex.substring(0, 12).toUpperCase()
  },

  // Get or generate MAC address
  getMacAddress: function () {
    var stored = this.getItem(this.KEYS.MAC_ADDRESS)
    if (stored) {
      return stored
    }

    // Generate new MAC and store it permanently
    var mac = this.generateMacAddress()
    this.setItem(this.KEYS.MAC_ADDRESS, mac)
    console.log("[v0] Generated MAC address:", mac)
    return mac
  },

  // Get or generate security code
  getSecurityCode: function () {
    var stored = this.getItem(this.KEYS.SECURITY_CODE)
    if (stored) {
      return stored
    }

    // Will be set from backend response
    return null
  },

  // Set security code (from backend)
  setSecurityCode: function (code) {
    this.setItem(this.KEYS.SECURITY_CODE, code)
  },

  // Check if device is registered
  isDeviceRegistered: function () {
    return !!this.getItem(this.KEYS.DEVICE_REGISTERED)
  },

  // Mark device as registered
  setDeviceRegistered: function () {
    this.setItem(this.KEYS.DEVICE_REGISTERED, true)
  },

  // Check if demo is activated
  isDemoActivated: function () {
    return !!this.getItem(this.KEYS.DEMO_ACTIVATED)
  },

  // Set demo activated
  setDemoActivated: function (endDate) {
    this.setItem(this.KEYS.DEMO_ACTIVATED, true)
    this.setItem(this.KEYS.DEMO_END_DATE, endDate)
  },

  // Check if demo is still valid
  isDemoValid: function () {
    if (!this.isDemoActivated()) {
      return false
    }

    var endDate = this.getItem(this.KEYS.DEMO_END_DATE)
    if (!endDate) {
      return false
    }

    var now = new Date().getTime()
    var end = new Date(endDate).getTime()

    return now < end
  },

  // Get playlist URL
  getPlaylistUrl: function () {
    return this.getItem(this.KEYS.PLAYLIST_URL)
  },

  // Set playlist URL
  setPlaylistUrl: function (url) {
    this.setItem(this.KEYS.PLAYLIST_URL, url)
  },
}
