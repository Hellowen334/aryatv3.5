// Favorites Manager for webOS 3.0-3.5
// Manage user's favorite channels/movies/series

var FavoritesManager = (() => {
  var STORAGE_KEY = "iptv_favorites"

  // Get all favorites
  function getFavorites() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      var favorites = JSON.parse(stored)
      return favorites || []
    } catch (e) {
      console.log("[v0] Error reading favorites:", e)
      return []
    }
  }

  // Save favorites
  function saveFavorites(favorites) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      return true
    } catch (e) {
      console.log("[v0] Error saving favorites:", e)
      return false
    }
  }

  // Check if item is favorite
  function isFavorite(itemId) {
    var favorites = getFavorites()
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].id === itemId) {
        return true
      }
    }
    return false
  }

  // Add to favorites
  function addFavorite(item) {
    var favorites = getFavorites()

    // Check if already exists
    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].id === item.id) {
        console.log("[v0] Item already in favorites")
        return false
      }
    }

    favorites.push(item)
    return saveFavorites(favorites)
  }

  // Remove from favorites
  function removeFavorite(itemId) {
    var favorites = getFavorites()
    var newFavorites = []

    for (var i = 0; i < favorites.length; i++) {
      if (favorites[i].id !== itemId) {
        newFavorites.push(favorites[i])
      }
    }

    return saveFavorites(newFavorites)
  }

  // Toggle favorite
  function toggleFavorite(item) {
    if (isFavorite(item.id)) {
      return removeFavorite(item.id)
    } else {
      return addFavorite(item)
    }
  }

  // Clear all favorites
  function clearFavorites() {
    return saveFavorites([])
  }

  return {
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
    toggleFavorite: toggleFavorite,
    clearFavorites: clearFavorites,
  }
})()
