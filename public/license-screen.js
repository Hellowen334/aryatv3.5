// License Screen Component for webOS 3.0-3.5
// Shows MAC, Security Code, Demo and Reload buttons

var React = window.React
var createElement = React.createElement

var StorageHelper = window.StorageHelper
var ApiHelper = window.ApiHelper

var LicenseScreen = (() => {
  function LicenseScreenConstructor(props) {
    React.Component.call(this, props)
    this.state = {
      mac: "",
      securityCode: "",
      loading: true,
      error: null,
      focusedButton: 0, // 0 = DEMO, 1 = RELOAD
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleDemoClick = this.handleDemoClick.bind(this)
    this.handleReloadClick = this.handleReloadClick.bind(this)
  }

  LicenseScreenConstructor.prototype = Object.create(React.Component.prototype)
  LicenseScreenConstructor.prototype.constructor = LicenseScreenConstructor

  LicenseScreenConstructor.prototype.componentDidMount = function () {
    

    // Get MAC address
    var mac = StorageHelper.getMacAddress()
    this.setState({ mac: mac })

    ApiHelper.registerDevice(mac, (error, response) => {
      if (error) {
        console.log("[v0] Device registration failed:", error)
        this.setState({
          loading: false,
          error: "Failed to connect to server. Please check your internet connection.",
        })
        return
      }

      if (response.success && response.device) {
        var securityCode = response.device.securityCode
        StorageHelper.setSecurityCode(securityCode)
        StorageHelper.setDeviceRegistered()

        this.setState({
          securityCode: securityCode,
          loading: false,
        })

        console.log("[v0] Device registered:", mac, securityCode)
      } else {
        this.setState({
          loading: false,
          error: "Failed to register device",
        })
      }
    })

    // Add remote control listener
    document.addEventListener("keydown", this.handleKeyDown)
  }

  LicenseScreenConstructor.prototype.componentWillUnmount = function () {
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  LicenseScreenConstructor.prototype.handleKeyDown = function (e) {
    var keyCode = e.keyCode
    var KEY_LEFT = 37
    var KEY_RIGHT = 39
    var KEY_ENTER = 13

    if (keyCode === KEY_LEFT) {
      e.preventDefault()
      this.setState({ focusedButton: 0 })
    } else if (keyCode === KEY_RIGHT) {
      e.preventDefault()
      this.setState({ focusedButton: 1 })
    } else if (keyCode === KEY_ENTER) {
      e.preventDefault()
      if (this.state.focusedButton === 0) {
        this.handleDemoClick()
      } else {
        this.handleReloadClick()
      }
    }
  }

  LicenseScreenConstructor.prototype.handleDemoClick = function () {
    
    var mac = this.state.mac
    var securityCode = this.state.securityCode

    console.log("[v0] Demo button clicked")
    this.setState({ loading: true, error: null })

    ApiHelper.activateDemo(mac, securityCode, (error, response) => {
      if (error) {
        console.log("[v0] Demo activation failed:", error)
        this.setState({
          loading: false,
          error: "Failed to activate demo. Please try again.",
        })
        return
      }

      if (response.success) {
        console.log("[v0] Demo activated successfully")
        StorageHelper.setDemoActivated(response.demoEndDate)

        if (response.playlistURL) {
          StorageHelper.setPlaylistUrl(response.playlistURL)
        }

        // Navigate to main app
        if (this.props.onSuccess) {
          this.props.onSuccess()
        }
      } else if (response.demoExpired) {
        this.setState({
          loading: false,
          error: "Demo period has expired. Please upload your playlist via www.aryatv.live",
        })
      } else {
        this.setState({
          loading: false,
          error: response.error || "Failed to activate demo",
        })
      }
    })
  }

  LicenseScreenConstructor.prototype.handleReloadClick = function () {
    
    var mac = this.state.mac
    var securityCode = this.state.securityCode

    console.log("[v0] Reload button clicked")
    this.setState({ loading: true, error: null })

    ApiHelper.checkLicense(mac, securityCode, (error, response) => {
      if (error) {
        console.log("[v0] License check failed:", error)
        this.setState({
          loading: false,
          error: "Failed to check license. Please try again.",
        })
        return
      }

      if (response.success) {
        if (response.hasCustomPlaylist && response.playlistURL) {
          console.log("[v0] Custom playlist found")
          StorageHelper.setPlaylistUrl(response.playlistURL)

          // Navigate to main app
          if (this.props.onSuccess) {
            this.props.onSuccess()
          }
        } else {
          this.setState({
            loading: false,
            error:
              "No playlist found. Please upload your playlist via www.aryatv.live using your MAC and Security Code.",
          })
        }
      } else {
        this.setState({
          loading: false,
          error: "License check failed",
        })
      }
    })
  }

  LicenseScreenConstructor.prototype.render = function () {
    var mac = this.state.mac
    var securityCode = this.state.securityCode
    var loading = this.state.loading
    var error = this.state.error
    var focusedButton = this.state.focusedButton

    return createElement(
      "div",
      { className: "license-screen" },
      createElement(
        "div",
        { className: "license-container" },
        createElement(
          "div",
          { className: "license-header" },
          createElement("div", { className: "license-logo" }, "IPTV"),
          createElement("div", { className: "license-subtitle" }, "Welcome to IPTV Player"),
        ),

        loading
          ? createElement(
              "div",
              { className: "license-loading" },
              createElement("div", { className: "spinner" }),
              createElement("p", null, "Loading..."),
            )
          : createElement(
              "div",
              { className: "license-content" },

              createElement(
                "div",
                { className: "license-info" },
                createElement(
                  "div",
                  { className: "license-info-item" },
                  createElement("div", { className: "license-label" }, "MAC Address"),
                  createElement("div", { className: "license-value" }, mac || "Loading..."),
                ),
                createElement(
                  "div",
                  { className: "license-info-item" },
                  createElement("div", { className: "license-label" }, "Security Code"),
                  createElement("div", { className: "license-value" }, securityCode || "Loading..."),
                ),
              ),

              error ? createElement("div", { className: "license-error" }, error) : null,

              createElement(
                "div",
                { className: "license-instructions" },
                createElement("p", null, "To use your custom playlist:"),
                createElement(
                  "ol",
                  null,
                  createElement("li", null, "Visit www.aryatv.live"),
                  createElement("li", null, "Enter your MAC Address and Security Code"),
                  createElement("li", null, "Upload your M3U playlist"),
                  createElement("li", null, "Click RELOAD LIST button"),
                ),
              ),

              createElement(
                "div",
                { className: "license-buttons" },
                createElement(
                  "button",
                  {
                    className: "license-button" + (focusedButton === 0 ? " focused" : ""),
                    onClick: this.handleDemoClick,
                    disabled: !securityCode,
                  },
                  "DEMO (7 Days)",
                ),
                createElement(
                  "button",
                  {
                    className: "license-button" + (focusedButton === 1 ? " focused" : ""),
                    onClick: this.handleReloadClick,
                    disabled: !securityCode,
                  },
                  "RELOAD LIST",
                ),
              ),
            ),
      ),
    )
  }

  return LicenseScreenConstructor
})()
