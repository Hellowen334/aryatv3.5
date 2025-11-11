var React = window.React
var ReactDOM = window.ReactDOM
var createElement = React.createElement

// Declare variables before using them
var IPTV_DATA = {
  liveChannels: [],
  movies: [],
  series: [],
}

var SearchIcon = () =>
  createElement("svg", { className: "search-icon" }, createElement("use", { href: "#search-icon" }))

var ContentGrid = (props) =>
  createElement(
    "div",
    { className: "content-grid" },
    props.items.map((item, index) =>
      createElement(
        "div",
        {
          key: index,
          className: "content-item",
          onClick: () => {
            props.onItemClick(item)
          },
        },
        item.title,
      ),
    ),
  )

var VideoPlayer = (props) =>
  createElement("video", {
    className: "video-player",
    controls: true,
    src: props.streamUrl,
  })

// Sidebar Component
var Sidebar = (props) =>
  createElement(
    "div",
    { className: "sidebar" },
    ["home", "live", "movies", "series"].map((page, index) =>
      createElement(
        "div",
        {
          key: index,
          className: "sidebar-item" + (page === props.currentPage ? " active" : ""),
          onClick: () => {
            props.onNavigate(page)
          },
        },
        page.charAt(0).toUpperCase() + page.slice(1),
      ),
    ),
  )

// License Screen Component
var LicenseScreen = (props) =>
  createElement(
    "div",
    { className: "license-screen" },
    createElement("h2", { className: "license-title" }, "Activate License"),
    createElement("input", {
      type: "text",
      className: "license-input",
      placeholder: "Enter Security Code",
      onChange: (e) => {
        props.onSecurityCodeChange(e.target.value)
      },
    }),
    createElement(
      "button",
      {
        className: "license-button",
        onClick: props.onActivate,
      },
      "Activate",
    ),
  )

// Expired Screen Component
var ExpiredScreen = () =>
  createElement(
    "div",
    { className: "expired-screen" },
    createElement("h2", { className: "expired-title" }, "License Expired"),
    createElement("p", { className: "expired-text" }, "Please contact support to renew your license."),
  )

// Helper functions for storage and API calls
var StorageHelper = {
  getMacAddress: () => {
    // Mock implementation
    return "00:1A:2B:3C:4D:5E"
  },
  getSecurityCode: () => {
    // Mock implementation
    return "123456"
  },
  isDeviceRegistered: () => {
    // Mock implementation
    return true
  },
  setPlaylistUrl: (url) => {
    // Mock implementation
    console.log("Playlist URL set to:", url)
  },
}

var ApiHelper = {
  checkLicense: (mac, securityCode, callback) => {
    // Mock implementation
    setTimeout(() => {
      callback(null, {
        success: true,
        hasCustomPlaylist: false,
        demoValid: true,
        demoExpired: false,
        playlistURL: "https://example.com/playlist.m3u8",
      })
    }, 1000)
  },
}

// Ana Uygulama Component
var App = (() => {
  function AppConstructor(props) {
    React.Component.call(this, props)
    this.state = {
      appState: "checking", // 'checking', 'license', 'expired', 'main'
      currentPage: "home",
      searchQuery: "",
      focusedItemIndex: -1,
      focusedNavIndex: 0,
    }

    // Remote control bindings
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.checkLicenseStatus = this.checkLicenseStatus.bind(this)
    this.handleLicenseSuccess = this.handleLicenseSuccess.bind(this)
  }

  AppConstructor.prototype = Object.create(React.Component.prototype)
  AppConstructor.prototype.constructor = AppConstructor

  AppConstructor.prototype.componentDidMount = function () {
    // Check license status on mount
    this.checkLicenseStatus()

    // Remote control event listener
    document.addEventListener("keydown", this.handleKeyDown)
    console.log("[v0] App mounted - Checking license status")
  }

  AppConstructor.prototype.componentWillUnmount = function () {
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  AppConstructor.prototype.checkLicenseStatus = function () {
    
    var mac = StorageHelper.getMacAddress()
    var securityCode = StorageHelper.getSecurityCode()

    console.log("[v0] Checking license status...")

    // First check: Is device registered?
    if (!StorageHelper.isDeviceRegistered() || !securityCode) {
      console.log("[v0] Device not registered, showing license screen")
      this.setState({ appState: "license" })
      return
    }

    // Second check: Check with backend
    ApiHelper.checkLicense(mac, securityCode, (error, response) => {
      if (error) {
        console.log("[v0] License check failed, showing license screen")
        this.setState({ appState: "license" })
        return
      }

      if (response.success) {
        // Has custom playlist?
        if (response.hasCustomPlaylist && response.playlistURL) {
          console.log("[v0] Custom playlist available, entering main app")
          StorageHelper.setPlaylistUrl(response.playlistURL)
          this.setState({ appState: "main" })
          return
        }

        // Demo valid?
        if (response.demoValid && response.playlistURL) {
          console.log("[v0] Demo is valid, entering main app")
          StorageHelper.setPlaylistUrl(response.playlistURL)
          this.setState({ appState: "main" })
          return
        }

        // Demo expired?
        if (response.demoExpired) {
          console.log("[v0] Demo expired, showing expired screen")
          this.setState({ appState: "expired" })
          return
        }

        // No license
        console.log("[v0] No valid license, showing license screen")
        this.setState({ appState: "license" })
      } else {
        this.setState({ appState: "license" })
      }
    })
  }

  AppConstructor.prototype.handleLicenseSuccess = function () {
    console.log("[v0] License activated successfully")
    this.setState({ appState: "main" })
  }

  AppConstructor.prototype.handleKeyDown = function (e) {
    var keyCode = e.keyCode
    console.log("[v0] Key pressed:", keyCode)

    // Key codes for LG webOS remote
    var KEY_LEFT = 37
    var KEY_UP = 38
    var KEY_RIGHT = 39
    var KEY_DOWN = 40
    var KEY_ENTER = 13
    var KEY_BACK = 461 // webOS back button
    var KEY_EXIT = 27 // ESC or exit

    switch (keyCode) {
      case KEY_LEFT:
        e.preventDefault()
        this.navigateLeft()
        break
      case KEY_UP:
        e.preventDefault()
        this.navigateUp()
        break
      case KEY_RIGHT:
        e.preventDefault()
        this.navigateRight()
        break
      case KEY_DOWN:
        e.preventDefault()
        this.navigateDown()
        break
      case KEY_ENTER:
        e.preventDefault()
        this.handleEnter()
        break
      case KEY_BACK:
      case KEY_EXIT:
        e.preventDefault()
        this.handleBack()
        break
    }
  }

  AppConstructor.prototype.navigateLeft = function () {
    // Sidebar'a geç
    if (this.state.focusedItemIndex >= 0) {
      this.setState({ focusedItemIndex: -1 })
    }
  }

  AppConstructor.prototype.navigateRight = function () {
    // İçeriğe geç
    if (this.state.focusedItemIndex === -1) {
      this.setState({ focusedItemIndex: 0 })
    }
  }

  AppConstructor.prototype.navigateUp = function () {
    if (this.state.focusedItemIndex === -1) {
      // Sidebar'da yukarı
      this.setState((prevState) => {
        var newIndex = prevState.focusedNavIndex - 1
        if (newIndex < 0) newIndex = 3 // 4 nav item var
        return { focusedNavIndex: newIndex }
      })
    } else {
      // İçerikte yukarı
      this.setState((prevState) => {
        var newIndex = prevState.focusedItemIndex - 6 // 6 sütun
        if (newIndex < 0) newIndex = 0
        return { focusedItemIndex: newIndex }
      })
    }
  }

  AppConstructor.prototype.navigateDown = function () {
    if (this.state.focusedItemIndex === -1) {
      // Sidebar'da aşağı
      this.setState((prevState) => {
        var newIndex = prevState.focusedNavIndex + 1
        if (newIndex > 3) newIndex = 0
        return { focusedNavIndex: newIndex }
      })
    } else {
      // İçerikte aşağı
      this.setState((prevState) => {
        var items = this.getFilteredItems()
        var newIndex = prevState.focusedItemIndex + 6
        if (newIndex >= items.length) newIndex = items.length - 1
        return { focusedItemIndex: newIndex }
      })
    }
  }

  AppConstructor.prototype.handleEnter = function () {
    if (this.state.focusedItemIndex === -1) {
      // Sidebar item seçildi
      var pages = ["home", "live", "movies", "series"]
      this.navigateTo(pages[this.state.focusedNavIndex])
    } else {
      // İçerik item seçildi
      var items = this.getFilteredItems()
      var item = items[this.state.focusedItemIndex]
      if (item) {
        this.handleItemClick(item)
      }
    }
  }

  AppConstructor.prototype.handleBack = function () {
    if (this.state.currentPage !== "home") {
      this.navigateTo("home")
    }
  }

  AppConstructor.prototype.navigateTo = function (page) {
    console.log("[v0] Navigating to:", page)
    this.setState({
      currentPage: page,
      focusedItemIndex: -1,
      searchQuery: "",
    })
  }

  AppConstructor.prototype.handleSearch = function (query) {
    this.setState({ searchQuery: query })
  }

  AppConstructor.prototype.handleItemClick = function (item) {
    console.log("[v0] Item clicked:", item.title)
    if (item.isLive) {
      // Live TV'ye geç
      this.setState({ currentPage: "live" })
    }
  }

  AppConstructor.prototype.getFilteredItems = function () {
    var query = this.state.searchQuery.toLowerCase()
    var page = this.state.currentPage
    var allItems = []

    if (page === "home") {
      allItems = allItems.concat(IPTV_DATA.liveChannels, IPTV_DATA.movies, IPTV_DATA.series)
    } else if (page === "live") {
      allItems = IPTV_DATA.liveChannels
    } else if (page === "movies") {
      allItems = IPTV_DATA.movies
    } else if (page === "series") {
      allItems = IPTV_DATA.series
    }

    if (query) {
      return allItems.filter((item) => item.title.toLowerCase().indexOf(query) !== -1)
    }

    return allItems
  }

  AppConstructor.prototype.render = function () {
    var appState = this.state.appState

    // Checking state
    if (appState === "checking") {
      return createElement(
        "div",
        { className: "app-loading" },
        createElement("div", { className: "spinner" }),
        createElement("p", null, "Loading IPTV Player..."),
      )
    }

    // License screen
    if (appState === "license") {
      return createElement(LicenseScreen, {
        onSuccess: this.handleLicenseSuccess,
      })
    }

    // Expired screen
    if (appState === "expired") {
      return createElement(ExpiredScreen)
    }

    var currentPage = this.state.currentPage
    var searchQuery = this.state.searchQuery

    var filteredLive = IPTV_DATA.liveChannels.filter(
      (item) => !searchQuery || item.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1,
    )

    var filteredMovies = IPTV_DATA.movies.filter(
      (item) => !searchQuery || item.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1,
    )

    var filteredSeries = IPTV_DATA.series.filter(
      (item) => !searchQuery || item.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1,
    )

    var hasResults = filteredLive.length > 0 || filteredMovies.length > 0 || filteredSeries.length > 0

    return createElement(
      "div",
      null,
      createElement(Sidebar, {
        currentPage: currentPage,
        onNavigate: (page) => {
          this.navigateTo(page)
        },
      }),
      createElement(
        "main",
        { className: "main-content" },
        // Header
        createElement(
          "div",
          { className: "header" },
          createElement("div", { className: "header-title" }, "IPTV"),
          createElement(
            "div",
            { className: "search-container" },
            createElement(SearchIcon),
            createElement("input", {
              type: "text",
              className: "search-input",
              placeholder: "Search By Title",
              value: searchQuery,
              onChange: (e) => {
                this.handleSearch(e.target.value)
              },
            }),
          ),
        ),

        // Home page
        currentPage === "home" &&
          (searchQuery && !hasResults
            ? createElement(
                "div",
                { className: "empty-state" },
                createElement("p", { className: "empty-state-title" }, "No results found"),
                createElement("p", { className: "empty-state-text" }, "Try searching for something else"),
              )
            : createElement(
                "div",
                null,
                filteredLive.length > 0 &&
                  createElement(
                    "section",
                    { className: "section" },
                    createElement(
                      "h2",
                      { className: "section-title" },
                      "Live" + (searchQuery ? " (" + filteredLive.length + ")" : ""),
                    ),
                    createElement(ContentGrid, {
                      items: filteredLive,
                      horizontal: true,
                      onItemClick: (item) => {
                        this.handleItemClick(item)
                      },
                    }),
                  ),
                filteredMovies.length > 0 &&
                  createElement(
                    "section",
                    { className: "section" },
                    createElement(
                      "h2",
                      { className: "section-title" },
                      "Movies" + (searchQuery ? " (" + filteredMovies.length + ")" : ""),
                    ),
                    createElement(ContentGrid, {
                      items: filteredMovies,
                      horizontal: false,
                      onItemClick: (item) => {
                        this.handleItemClick(item)
                      },
                    }),
                  ),
                filteredSeries.length > 0 &&
                  createElement(
                    "section",
                    { className: "section" },
                    createElement(
                      "h2",
                      { className: "section-title" },
                      "Series" + (searchQuery ? " (" + filteredSeries.length + ")" : ""),
                    ),
                    createElement(ContentGrid, {
                      items: filteredSeries.slice(0, 2),
                      horizontal: false,
                      onItemClick: (item) => {
                        this.handleItemClick(item)
                      },
                    }),
                  ),
              )),

        // Live TV page
        currentPage === "live" &&
          createElement(
            "section",
            { className: "section" },
            createElement("h2", { className: "section-title" }, "Live TV"),
            createElement(VideoPlayer, {
              streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            }),
            createElement(
              "div",
              { style: { marginTop: "20px" } },
              createElement(ContentGrid, {
                items: filteredLive,
                horizontal: true,
                onItemClick: (item) => {
                  this.handleItemClick(item)
                },
              }),
            ),
          ),

        // Movies page
        currentPage === "movies" &&
          createElement(
            "section",
            { className: "section" },
            createElement("h2", { className: "section-title" }, "Movies"),
            createElement(ContentGrid, {
              items: filteredMovies,
              horizontal: false,
              onItemClick: (item) => {
                this.handleItemClick(item)
              },
            }),
          ),

        // Series page
        currentPage === "series" &&
          createElement(
            "section",
            { className: "section" },
            createElement("h2", { className: "section-title" }, "Series"),
            createElement(ContentGrid, {
              items: filteredSeries,
              horizontal: false,
              onItemClick: (item) => {
                this.handleItemClick(item)
              },
            }),
          ),
      ),
    )
  }

  return AppConstructor
})()

// Uygulamayı başlat
ReactDOM.render(createElement(App), document.getElementById("root"))

console.log("[v0] IPTV Player initialized for webOS 3.5")
