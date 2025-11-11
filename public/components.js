var React = window.React
var ReactDOM = window.ReactDOM
var createElement = React.createElement

// Icon Components (Simple SVG wrappers)
function HomeIcon() {
  return createElement(
    "svg",
    { className: "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    createElement("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
    createElement("polyline", { points: "9 22 9 12 15 12 15 22" }),
  )
}

function TvIcon() {
  return createElement(
    "svg",
    { className: "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    createElement("rect", { x: "2", y: "7", width: "20", height: "15", rx: "2", ry: "2" }),
    createElement("polyline", { points: "17 2 12 7 7 2" }),
  )
}

function FilmIcon() {
  return createElement(
    "svg",
    { className: "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    createElement("rect", { x: "2", y: "2", width: "20", height: "20", rx: "2.18", ry: "2.18" }),
    createElement("line", { x1: "7", y1: "2", x2: "7", y2: "22" }),
    createElement("line", { x1: "17", y1: "2", x2: "17", y2: "22" }),
    createElement("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
    createElement("line", { x1: "2", y1: "7", x2: "7", y2: "7" }),
    createElement("line", { x1: "2", y1: "17", x2: "7", y2: "17" }),
    createElement("line", { x1: "17", y1: "17", x2: "22", y2: "17" }),
    createElement("line", { x1: "17", y1: "7", x2: "22", y2: "7" }),
  )
}

function MonitorPlayIcon() {
  return createElement(
    "svg",
    { className: "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    createElement("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
    createElement("path", { d: "M8 21h8" }),
    createElement("path", { d: "M12 17v4" }),
    createElement("polygon", { points: "10 9 15 12 10 15" }),
  )
}

function SearchIcon() {
  return createElement(
    "svg",
    { className: "icon search-icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
    createElement("circle", { cx: "11", cy: "11", r: "8" }),
    createElement("path", { d: "m21 21-4.35-4.35" }),
  )
}

// Sidebar Component
var Sidebar = (() => {
  function SidebarConstructor(props) {
    React.Component.call(this, props)
  }

  SidebarConstructor.prototype = Object.create(React.Component.prototype)
  SidebarConstructor.prototype.constructor = SidebarConstructor

  SidebarConstructor.prototype.render = function () {
    
    var currentPage = this.props.currentPage

    var navItems = [
      { id: "home", icon: HomeIcon, label: "Ana Sayfa" },
      { id: "live", icon: TvIcon, label: "Canlı TV" },
      { id: "movies", icon: FilmIcon, label: "Filmler" },
      { id: "series", icon: MonitorPlayIcon, label: "Diziler" },
    ]

    return createElement(
      "aside",
      { className: "sidebar" },
      createElement(
        "div",
        { className: "sidebar-logo" },
        createElement(
          "div",
          { className: "sidebar-logo-text" },
          createElement("div", { className: "sidebar-logo-main" }, "IPTV"),
          createElement("div", { className: "sidebar-logo-sub" }, "PLAYER"),
        ),
      ),
      createElement(
        "nav",
        { className: "sidebar-nav" },
        navItems.map((item) => {
          var isActive = currentPage === item.id
          var className = "sidebar-nav-item" + (isActive ? " active" : "")

          return createElement(
            "button",
            {
              key: item.id,
              className: className,
              "data-nav-id": item.id,
              onClick: () => {
                this.props.onNavigate(item.id)
              },
              "aria-label": item.label,
            },
            createElement(item.icon),
          )
        }),
      ),
    )
  }

  return SidebarConstructor
})()

// Content Card Component
var ContentCard = (() => {
  function ContentCardConstructor(props) {
    React.Component.call(this, props)
  }

  ContentCardConstructor.prototype = Object.create(React.Component.prototype)
  ContentCardConstructor.prototype.constructor = ContentCardConstructor

  ContentCardConstructor.prototype.render = function () {
    var item = this.props.item
    var isHorizontal = this.props.horizontal
    var onClick = this.props.onClick

    var containerClass = "card-image-container" + (isHorizontal ? "" : " vertical")

    return createElement(
      "button",
      {
        className: "card",
        onClick: onClick,
        "data-item-id": item.id,
      },
      createElement(
        "div",
        { className: containerClass },
        createElement("img", {
          className: "card-image",
          src: item.thumbnail,
          alt: item.title,
          onError: (e) => {
            e.target.src = "/abstract-geometric-shapes.png"
          },
        }),
        item.isLive ? createElement("div", { className: "card-live-badge" }, "LIVE") : null,
        createElement(
          "div",
          { className: "card-overlay" },
          createElement("div", { className: "card-title" }, item.title),
        ),
      ),
    )
  }

  return ContentCardConstructor
})()

// Content Grid Component
var ContentGrid = (() => {
  function ContentGridConstructor(props) {
    React.Component.call(this, props)
  }

  ContentGridConstructor.prototype = Object.create(React.Component.prototype)
  ContentGridConstructor.prototype.constructor = ContentGridConstructor

  ContentGridConstructor.prototype.render = function () {
    var items = this.props.items
    var horizontal = this.props.horizontal
    var onItemClick = this.props.onItemClick

    var gridClass = horizontal ? "content-grid-horizontal" : "content-grid"
    var itemClass = horizontal ? "content-item-horizontal" : "content-item"

    return createElement(
      "div",
      { className: gridClass },
      items.map((item) =>
        createElement(
          "div",
          { key: item.id, className: itemClass },
          createElement(ContentCard, {
            item: item,
            horizontal: horizontal,
            onClick: () => {
              if (onItemClick) onItemClick(item)
            },
          }),
        ),
      ),
    )
  }

  return ContentGridConstructor
})()

// Video Player Component
var VideoPlayer = (() => {
  function VideoPlayerConstructor(props) {
    React.Component.call(this, props)
    this.state = {
      isPlaying: false,
      progress: 0,
      duration: 0,
    }
    this.videoRef = null
    this.hlsInstance = null
  }

  VideoPlayerConstructor.prototype = Object.create(React.Component.prototype)
  VideoPlayerConstructor.prototype.constructor = VideoPlayerConstructor

  VideoPlayerConstructor.prototype.componentDidMount = function () {
    
    var streamUrl = this.props.streamUrl

    if (this.videoRef && streamUrl) {
      // HLS.js desteği kontrolü
      if (streamUrl.indexOf(".m3u8") !== -1) {
        if (window.Hls && window.Hls.isSupported()) {
          console.log("[v0] HLS.js initializing for webOS 3.5")
          this.hlsInstance = new window.Hls({
            debug: false,
            enableWorker: false, // webOS 3.5 için worker'ı kapat
            manifestLoadingTimeOut: 10000,
            manifestLoadingMaxRetry: 3,
            xhrSetup: (xhr, url) => {
              // CORS için header ekle
              xhr.withCredentials = false
            },
          })

          this.hlsInstance.loadSource(streamUrl)
          this.hlsInstance.attachMedia(this.videoRef)

          this.hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
            console.log("[v0] HLS manifest parsed")
            this.videoRef.play().catch((err) => {
              console.log("[v0] Autoplay prevented:", err)
            })
          })

          this.hlsInstance.on(window.Hls.Events.ERROR, (event, data) => {
            console.log("[v0] HLS error:", data.type, data.details)
            if (data.fatal) {
              switch (data.type) {
                case window.Hls.ErrorTypes.NETWORK_ERROR:
                  console.log("[v0] Network error, trying to recover")
                  this.hlsInstance.startLoad()
                  break
                case window.Hls.ErrorTypes.MEDIA_ERROR:
                  console.log("[v0] Media error, trying to recover")
                  this.hlsInstance.recoverMediaError()
                  break
                default:
                  console.log("[v0] Fatal error, cannot recover")
                  break
              }
            }
          })
        } else if (this.videoRef.canPlayType("application/vnd.apple.mpegurl")) {
          // Safari veya native HLS desteği
          this.videoRef.src = streamUrl
        }
      } else {
        // MP4 veya başka format
        this.videoRef.src = streamUrl
      }
    }
  }

  VideoPlayerConstructor.prototype.componentWillUnmount = function () {
    if (this.hlsInstance) {
      this.hlsInstance.destroy()
      this.hlsInstance = null
    }
  }

  VideoPlayerConstructor.prototype.togglePlay = function () {
    if (this.videoRef) {
      if (this.videoRef.paused) {
        this.videoRef.play()
        this.setState({ isPlaying: true })
      } else {
        this.videoRef.pause()
        this.setState({ isPlaying: false })
      }
    }
  }

  VideoPlayerConstructor.prototype.render = function () {
    
    var isPlaying = this.state.isPlaying

    return createElement(
      "div",
      { className: "video-player-container" },
      createElement("video", {
        ref: (el) => {
          this.videoRef = el
        },
        className: "video-player",
        controls: false,
        onTimeUpdate: (e) => {
          var progress = (e.target.currentTime / e.target.duration) * 100
          this.setState({ progress: progress || 0 })
        },
        onLoadedMetadata: (e) => {
          this.setState({ duration: e.target.duration })
        },
      }),
      createElement(
        "div",
        { className: "video-controls" },
        createElement(
          "button",
          {
            className: "video-control-btn",
            onClick: () => {
              this.togglePlay()
            },
          },
          isPlaying ? "⏸" : "▶",
        ),
        createElement(
          "div",
          {
            className: "video-progress",
            onClick: (e) => {
              if (this.videoRef) {
                var rect = e.currentTarget.getBoundingClientRect()
                var pos = (e.clientX - rect.left) / rect.width
                this.videoRef.currentTime = pos * this.videoRef.duration
              }
            },
          },
          createElement("div", {
            className: "video-progress-bar",
            style: { width: this.state.progress + "%" },
          }),
        ),
      ),
    )
  }

  return VideoPlayerConstructor
})()
