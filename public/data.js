var IPTV_DATA = {
  categories: [
    { id: "all", name: "All", count: 8 },
    { id: "news", name: "News", count: 2 },
    { id: "nature", name: "Nature", count: 3 },
    { id: "animals", name: "Animals", count: 3 },
  ],

  liveChannels: [
    {
      id: "1",
      title: "Demo News 1",
      thumbnail: "/breaking-news-studio.jpg",
      category: "news",
      isLive: true,
      streamUrl: "", // HLS stream URL buraya eklenecek
    },
    {
      id: "2",
      title: "Demo News 2",
      thumbnail: "/news-broadcast-blue.jpg",
      category: "news",
      isLive: true,
      streamUrl: "",
    },
    {
      id: "3",
      title: "Demo Nature 1",
      thumbnail: "/waterfall-nature-green.jpg",
      category: "nature",
      isLive: true,
      streamUrl: "",
    },
    {
      id: "4",
      title: "Demo Nature 2",
      thumbnail: "/forest-waterfall.png",
      category: "nature",
      isLive: true,
      streamUrl: "",
    },
    {
      id: "5",
      title: "Demo Nature 3",
      thumbnail: "/pink-flowers-garden.jpg",
      category: "nature",
      isLive: true,
      streamUrl: "",
    },
    {
      id: "6",
      title: "Demo Animals 1",
      thumbnail: "/tropical-fish-coral-reef.png",
      category: "animals",
      isLive: true,
      streamUrl: "",
    },
  ],

  movies: [
    { id: "m1", title: "Demo News 1", thumbnail: "/movie-poster-news.jpg", category: "news" },
    { id: "m2", title: "Demo News 2", thumbnail: "/breaking-live-news-blue.jpg", category: "news" },
    { id: "m3", title: "Demo Nature 1", thumbnail: "/lush-waterfall.png", category: "nature" },
    { id: "m4", title: "Demo Nature 2", thumbnail: "/forest-waterfall-dark.jpg", category: "nature" },
    { id: "m5", title: "Demo Nature 3", thumbnail: "/sunset-lake-flowers.jpg", category: "nature" },
    { id: "m6", title: "Demo Animals 1", thumbnail: "/tropical-fish-underwater.png", category: "animals" },
    { id: "m7", title: "Demo Animals 2", thumbnail: "/jellyfish-purple.jpg", category: "animals" },
    { id: "m8", title: "Demo Animals 3", thumbnail: "/elephant-wildlife.png", category: "animals" },
  ],

  series: [
    { id: "s1", title: "Demo Series 1", thumbnail: "/tv-series-poster.png", category: "news" },
    { id: "s2", title: "Demo Series 2", thumbnail: "/nature-documentary.png", category: "nature" },
  ],
}
