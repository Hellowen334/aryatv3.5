// Settings Screen Component for webOS 3.0-3.5
// MAC, Security Code, Playlist management, Favorites

var React = window.React
var createElement = React.createElement

var StorageHelper = window.StorageHelper // Declare StorageHelper
var ApiHelper = window.ApiHelper // Declare ApiHelper

var SettingsScreen = (() => {
  function SettingsScreenConstructor(props) {
    React.Component.call(this, props)

    this.state = {
      mac: "",
      securityCode: "",
      playlistUrl: "",
      connectionStatus: "checking",
      focusedItem: 0,
      showResetConfirm: false,
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleReloadPlaylist = this.handleReloadPlaylist.bind(this)
    this.handleResetFavorites = this.handleResetFavorites.bind(this)
    this.handleTestConnection = this.handleTestConnection.bind(this)
  }

  SettingsScreenConstructor.prototype = Object.create(React.Component.prototype)
  SettingsScreenConstructor.prototype.constructor = SettingsScreenConstructor

  SettingsScreenConstructor.prototype.componentDidMount = function () {
    var mac = StorageHelper.getMacAddress()
    var securityCode = StorageHelper.getSecurityCode()
    var playlistUrl = StorageHelper.getPlaylistUrl()

    this.setState({
      mac: mac || "Not available",
      securityCode: securityCode || "Not registered",
      playlistUrl: playlistUrl || "No playlist loaded",
    })

    this.handleTestConnection()
    document.addEventListener("keydown", this.handleKeyDown)
  }

  SettingsScreenConstructor.prototype.componentWillUnmount = function () {
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  SettingsScreenConstructor.prototype.handleKeyDown = function (e) {
    var keyCode = e.keyCode
    var KEY_UP = 38
    var KEY_DOWN = 40
    var KEY_ENTER = 13
    var KEY_BACK = 461

    if (keyCode === KEY_UP) {
      e.preventDefault()
      this.setState((prevState) => {
        var newIndex = prevState.focusedItem - 1
        if (newIndex < 0) newIndex = 2
        return { focusedItem: newIndex }
      })
    } else if (keyCode === KEY_DOWN) {
      e.preventDefault()
      this.setState((prevState) => {
        var newIndex = prevState.focusedItem + 1
        if (newIndex > 2) newIndex = 0
        return { focusedItem: newIndex }
      })
    } else if (keyCode === KEY_ENTER) {
      e.preventDefault()
      this.handleEnterKey()
    } else if (keyCode === KEY_BACK) {
      e.preventDefault()
      if (this.props.onBack) {
        this.props.onBack()
      }
    }
  }

  SettingsScreenConstructor.prototype.handleEnterKey = function () {
    var focusedItem = this.state.focusedItem

    if (focusedItem === 0) {
      this.handleReloadPlaylist()
    } else if (focusedItem === 1) {
      this.handleTestConnection()
    } else if (focusedItem === 2) {
      this.setState({ showResetConfirm: true })
    }
  }

  SettingsScreenConstructor.prototype.handleReloadPlaylist = function () {
    
    var mac = this.state.mac
    var securityCode = this.state.securityCode

    console.log("[v0] Reloading playlist")
    this.setState({ connectionStatus: "loading" })

    ApiHelper.getPlaylist(mac, securityCode, (error, response) => {
      if (error) {
        console.log("[v0] Playlist reload failed:", error)
        this.setState({ connectionStatus: "error" })
        return
      }

      if (response.success && response.playlistURL) {
        StorageHelper.setPlaylistUrl(response.playlistURL)
        this.setState({
          playlistUrl: response.playlistURL,
          connectionStatus: "connected",
        })

        // Reload app
        if (this.props.onPlaylistReloaded) {
          this.props.onPlaylistReloaded()
        }
      } else {
        this.setState({ connectionStatus: "no_playlist" })
      }
    })
  }

  SettingsScreenConstructor.prototype.handleTestConnection = function () {
    
    var mac = this.state.mac
    var securityCode = this.state.securityCode

    this.setState({ connectionStatus: "checking" })

    ApiHelper.checkLicense(mac, securityCode, (error, response) => {
      if (error) {
        this.setState({ connectionStatus: "error" })
        return
      }

      if (response.success) {
        this.setState({ connectionStatus: "connected" })
      } else {
        this.setState({ connectionStatus: "disconnected" })
      }
    })
  }

  SettingsScreenConstructor.prototype.handleResetFavorites = function () {
    if (!this.state.showResetConfirm) {
      this.setState({ showResetConfirm: true })
      return
    }

    // Clear favorites from localStorage
    localStorage.removeItem("iptv_favorites")
    this.setState({ showResetConfirm: false })
    console.log("[v0] Favorites reset")
  }

  SettingsScreenConstructor.prototype.render = function () {
    var mac = this.state.mac
    var securityCode = this.state.securityCode
    var playlistUrl = this.state.playlistUrl
    var connectionStatus = this.state.connectionStatus
    var focusedItem = this.state.focusedItem
    var showResetConfirm = this.state.showResetConfirm

    var statusText =
      connectionStatus === "checking"
        ? "Checking..."
        : connectionStatus === "connected"
          ? "Connected"
          : connectionStatus === "error"
            ? "Connection Error"
            : connectionStatus === "no_playlist"
              ? "No Playlist"
              : connectionStatus === "loading"
                ? "Loading..."
                : "Disconnected"

    var statusClass = "settings-status-" + connectionStatus

    return createElement(
      "div",
      { className: "settings-screen" },
      createElement(
        "div",
        { className: "settings-container" },
        createElement("h1", { className: "settings-title" }, "Settings"),

        createElement(
          "div",
          { className: "settings-info-grid" },
          createElement(
            "div",
            { className: "settings-info-item" },
            createElement("div", { className: "settings-label" }, "MAC Address"),
            createElement("div", { className: "settings-value" }, mac),
          ),
          createElement(
            "div",
            { className: "settings-info-item" },
            createElement("div", { className: "settings-label" }, "Security Code"),
            createElement("div", { className: "settings-value" }, securityCode),
          ),
          createElement(
            "div",
            { className: "settings-info-item settings-full-width" },
            createElement("div", { className: "settings-label" }, "Playlist URL"),
            createElement("div", { className: "settings-value settings-url" }, playlistUrl),
          ),
        ),

        createElement(
          "div",
          { className: "settings-status" },
          createElement("span", { className: "settings-label" }, "Connection Status:"),
          createElement("span", { className: statusClass }, statusText),
        ),

        createElement(
          "div",
          { className: "settings-actions" },
          createElement(
            "button",
            {
              className: "settings-button" + (focusedItem === 0 ? " focused" : ""),
              onClick: this.handleReloadPlaylist,
            },
            "Reload Playlist",
          ),
          createElement(
            "button",
            {
              className: "settings-button" + (focusedItem === 1 ? " focused" : ""),
              onClick: this.handleTestConnection,
            },
            "Test Connection",
          ),
          createElement(
            "button",
            {
              className: "settings-button settings-danger" + (focusedItem === 2 ? " focused" : ""),
              onClick: this.handleResetFavorites,
            },
            showResetConfirm ? "Confirm Reset?" : "Reset Favorites",
          ),
        ),

        createElement(
          "div",
          { className: "settings-info-box" },
          createElement("p", null, "To upload your own playlist:"),
          createElement("p", null, "1. Visit www.aryatv.live"),
          createElement("p", null, "2. Enter your MAC and Security Code"),
          createElement("p", null, "3. Upload your M3U file"),
          createElement("p", null, '4. Click "Reload Playlist" button above'),
        ),
      ),
    )
  }

  return SettingsScreenConstructor
})()
