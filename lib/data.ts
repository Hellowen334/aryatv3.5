// Demo veriler için tip tanımları
export interface Channel {
  id: string
  title: string
  thumbnail: string
  category: string
  isLive?: boolean
}

export interface Category {
  id: string
  name: string
  count: number
}

// Demo kategoriler
export const categories: Category[] = [
  { id: "all", name: "All", count: 8 },
  { id: "news", name: "News", count: 2 },
  { id: "nature", name: "Nature", count: 3 },
  { id: "animals", name: "Animals", count: 3 },
]

// Demo kanallar - Live TV
export const liveChannels: Channel[] = [
  {
    id: "1",
    title: "Demo News 1",
    thumbnail: "/breaking-live-news-studio-red-blue.jpg",
    category: "news",
    isLive: true,
  },
  {
    id: "2",
    title: "Demo News 2",
    thumbnail: "/news-broadcast-blue-studio.jpg",
    category: "news",
    isLive: true,
  },
  {
    id: "3",
    title: "Demo Nature 1",
    thumbnail: "/waterfall-nature-green-forest.jpg",
    category: "nature",
    isLive: true,
  },
  {
    id: "4",
    title: "Demo Nature 2",
    thumbnail: "/forest-waterfall-nature.jpg",
    category: "nature",
    isLive: true,
  },
  {
    id: "5",
    title: "Demo Nature 3",
    thumbnail: "/pink-flowers-garden-nature.jpg",
    category: "nature",
    isLive: true,
  },
  {
    id: "6",
    title: "Demo Animals 1",
    thumbnail: "/tropical-fish-coral-reef-colorful.jpg",
    category: "animals",
    isLive: true,
  },
]

// Demo filmler
export const movies: Channel[] = [
  {
    id: "m1",
    title: "Demo News 1",
    thumbnail: "/breaking-live-news-movie-poster.jpg",
    category: "news",
  },
  {
    id: "m2",
    title: "Demo News 2",
    thumbnail: "/breaking-live-news-blue-red.jpg",
    category: "news",
  },
  {
    id: "m3",
    title: "Demo Nature 1",
    thumbnail: "/waterfall-nature-green.jpg",
    category: "nature",
  },
  {
    id: "m4",
    title: "Demo Nature 2",
    thumbnail: "/forest-waterfall-nature-dark.jpg",
    category: "nature",
  },
  {
    id: "m5",
    title: "Demo Nature 3",
    thumbnail: "/sunset-lake-pink-flowers.jpg",
    category: "nature",
  },
  {
    id: "m6",
    title: "Demo Animals 1",
    thumbnail: "/tropical-fish-underwater.png",
    category: "animals",
  },
  {
    id: "m7",
    title: "Demo Animals 2",
    thumbnail: "/jellyfish-purple-underwater.jpg",
    category: "animals",
  },
  {
    id: "m8",
    title: "Demo Animals 3",
    thumbnail: "/elephant-wildlife.png",
    category: "animals",
  },
]

// Demo diziler
export const series: Channel[] = [
  {
    id: "s1",
    title: "Demo Series 1",
    thumbnail: "/tv-series-poster-dramatic.jpg",
    category: "news",
  },
  {
    id: "s2",
    title: "Demo Series 2",
    thumbnail: "/nature-documentary-series.jpg",
    category: "nature",
  },
]
