// M3U Parser for webOS 3.0-3.5
// Büyük dosyalar için optimize edilmiş, bellek dostu parser

var M3UParser = (() => {
  // Helper: String içinde arama
  function contains(str, search) {
    return str.indexOf(search) !== -1
  }

  // Helper: String küçük harfe çevir
  function lowercase(str) {
    return str ? str.toLowerCase() : ""
  }

  // Helper: Kategorilere göre filtrele
  function categorizeStream(line, url) {
    var lowerLine = lowercase(line)
    var lowerUrl = lowercase(url)

    // Live TV detection
    var isLive =
      contains(lowerLine, "live") ||
      contains(lowerLine, "tv:") ||
      contains(lowerUrl, ".ts") ||
      contains(lowerUrl, "/live/") ||
      (!contains(lowerUrl, ".mkv") && !contains(lowerUrl, ".mp4") && !contains(lowerUrl, ".avi"))

    // Movie detection
    var isMovie =
      contains(lowerLine, "movie") ||
      contains(lowerLine, "film") ||
      contains(lowerLine, "vod") ||
      contains(lowerUrl, ".mkv") ||
      contains(lowerUrl, ".mp4") ||
      contains(lowerUrl, ".avi") ||
      contains(lowerUrl, "/movies/")

    // Series detection
    var isSeries =
      contains(lowerLine, "series") ||
      contains(lowerLine, "serie") ||
      contains(lowerLine, "dizi") ||
      contains(lowerLine, "s01e") ||
      contains(lowerLine, "s02e") ||
      contains(lowerUrl, "/series/")

    if (isSeries) return "series"
    if (isMovie) return "movies"
    if (isLive) return "live"
    return "live" // Default
  }

  // Helper: Group title çıkar
  function extractGroupTitle(line) {
    var groupIndex = line.indexOf('group-title="')
    if (groupIndex === -1) return "Uncategorized"

    var start = groupIndex + 13
    var end = line.indexOf('"', start)
    if (end === -1) return "Uncategorized"

    return line.substring(start, end)
  }

  // Helper: Logo URL çıkar
  function extractLogo(line) {
    var logoIndex = line.indexOf('tvg-logo="')
    if (logoIndex === -1) return ""

    var start = logoIndex + 10
    var end = line.indexOf('"', start)
    if (end === -1) return ""

    return line.substring(start, end)
  }

  // Helper: Başlık çıkar
  function extractTitle(line) {
    var commaIndex = line.lastIndexOf(",")
    if (commaIndex === -1) return "Unnamed Channel"

    var title = line.substring(commaIndex + 1).trim()
    return title || "Unnamed Channel"
  }

  // Ana parsing fonksiyonu - Satır satır işler (bellek dostu)
  function parse(m3uContent, progressCallback) {
    var lines = m3uContent.split("\n")
    var channels = {
      live: [],
      movies: [],
      series: [],
    }

    var currentLine = null
    var processedCount = 0
    var totalLines = lines.length

    console.log("[v0] M3U Parser: Processing " + totalLines + " lines")

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()

      // Progress callback her 100 satırda
      if (progressCallback && processedCount % 100 === 0) {
        progressCallback(processedCount, totalLines)
      }

      if (line.indexOf("#EXTINF:") === 0) {
        currentLine = line
      } else if (line && line.indexOf("#") !== 0 && currentLine) {
        // Bu bir URL satırı
        var url = line
        var title = extractTitle(currentLine)
        var logo = extractLogo(currentLine)
        var group = extractGroupTitle(currentLine)
        var category = categorizeStream(currentLine, url)

        var channel = {
          id: "ch_" + processedCount,
          title: title,
          url: url,
          thumbnail: logo || "/placeholder.svg?height=200&width=300&text=" + encodeURIComponent(title),
          group: group,
          isLive: category === "live",
        }

        channels[category].push(channel)
        processedCount++
        currentLine = null
      }
    }

    console.log("[v0] M3U Parser: Completed")
    console.log("[v0] Live:", channels.live.length)
    console.log("[v0] Movies:", channels.movies.length)
    console.log("[v0] Series:", channels.series.length)

    return channels
  }

  // Network'ten M3U yükle (XMLHttpRequest kullanarak)
  function loadFromUrl(url, onSuccess, onError, onProgress) {
    console.log("[v0] Loading M3U from:", url)

    var xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.timeout = 30000 // 30 saniye timeout

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("[v0] M3U downloaded, parsing...")
          try {
            var channels = parse(xhr.responseText, onProgress)
            onSuccess(channels)
          } catch (e) {
            console.log("[v0] M3U parse error:", e)
            onError(e)
          }
        } else {
          console.log("[v0] M3U download failed:", xhr.status)
          onError(new Error("HTTP " + xhr.status))
        }
      }
    }

    xhr.onerror = () => {
      console.log("[v0] M3U network error")
      onError(new Error("Network error"))
    }

    xhr.ontimeout = () => {
      console.log("[v0] M3U timeout")
      onError(new Error("Timeout"))
    }

    xhr.send()
  }

  return {
    parse: parse,
    loadFromUrl: loadFromUrl,
  }
})()
