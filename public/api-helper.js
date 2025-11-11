// API Helper for webOS 3.0-3.5 (ES5 only, XMLHttpRequest)
// Backend API communication with old LG TVs

var API_BASE_URL = "https://api.aryatv.live" // Backend URL

var ApiHelper = {
  // XMLHttpRequest wrapper for ES5
  makeRequest: (method, url, data, callback) => {
    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var response = JSON.parse(xhr.responseText)
            callback(null, response)
          } catch (e) {
            callback({ error: "Invalid JSON response" }, null)
          }
        } else {
          callback({ error: "Request failed", status: xhr.status }, null)
        }
      }
    }

    xhr.onerror = () => {
      callback({ error: "Network error" }, null)
    }

    xhr.ontimeout = () => {
      callback({ error: "Request timeout" }, null)
    }

    var fullUrl = API_BASE_URL + url
    xhr.open(method, fullUrl, true)
    xhr.timeout = 30000
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Accept", "application/json")

    if (data) {
      xhr.send(JSON.stringify(data))
    } else {
      xhr.send()
    }
  },

  // Register device
  registerDevice: function (mac, callback) {
    console.log("[v0] Registering device:", mac)
    this.makeRequest("POST", "/api/device/register", { mac: mac }, callback)
  },

  // Activate demo (7 days)
  activateDemo: function (mac, securityCode, callback) {
    console.log("[v0] Activating demo:", mac)
    this.makeRequest(
      "POST",
      "/api/device/activate-demo",
      {
        mac: mac,
        securityCode: securityCode,
      },
      callback,
    )
  },

  // Check license status
  checkLicense: function (mac, securityCode, callback) {
    console.log("[v0] Checking license:", mac)
    this.makeRequest(
      "POST",
      "/api/device/check-license",
      {
        mac: mac,
        securityCode: securityCode,
      },
      callback,
    )
  },

  // Get custom playlist
  getPlaylist: function (mac, securityCode, callback) {
    this.checkLicense(mac, securityCode, callback)
  },
}
