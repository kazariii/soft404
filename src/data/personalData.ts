export type ScheduleItem = {
  time: string
  title: string
  detail: string
}

export type Film = {
  title: string
  year: string
  rating: string
  mood: string
  note: string
  image: string
}

export type Book = {
  title: string
  author: string
  status: string
  note: string
  image: string
}

export type Photo = {
  src: string
  caption: string
  location: string
}

export type SpotifyPlaylist = {
  title: string
  mood: string
  description: string
  embedUrl: string
}

export type SocialLink = {
  label: string
  url: string
}

export const todayPlan: ScheduleItem[] = [
  {
    time: "09:00",
    title: "a gentle beginning",
    detail: "Coffee warming my hands, music filling the quiet, and another morning learning how to begin.",
  },
  {
    time: "13:00",
    title: "somewhere between learning and becoming",
    detail: "A day of questions, stubborn code, and small discoveries hiding inside the ordinary.",
  },
  {
    time: "19:30",
    title: "stories after sunset",
    detail: "Letting another life unfold on screen, knowing it may follow me into the night.",
  },
]

export const films: Film[] = [
  {
    title: "Drawing Closer",
    year: "2024",
    rating: "★★★★★",
    mood: "beautiful pain",
    note: "Beautiful in the way some goodbyes are—brief, luminous, and unbearably unfair.",
    image: "/films/film-1.jpg",
  },
  {
    title: "18×2 Beyond Youthful Days",
    year: "2024",
    rating: "★★★★☆",
    mood: "quiet longing",
    note: "A quiet journey through distance, memory, and everything youth leaves unfinished.",
    image: "/films/film-2.jpg",
  },
  {
    title: "20th Century Girl",
    year: "2022",
    rating: "★★★★☆",
    mood: "nostalgic heartbreak",
    note: "The kind of first love that ends, yet somehow never learns how to leave.",
    image: "/films/film-3.jpg",
  },
  {
    title: "Forget Me Not",
    year: "2015",
    rating: "★★★★☆",
    mood: "fading memories",
    note: "A tender ache about loving someone even as the world forgets they were ever here.",
    image: "/films/film-4.jpg",
  },
  {
    title: "Jatuh Cinta Seperti di Film-Film",
    year: "2023",
    rating: "★★★★★",
    mood: "love in monochrome",
    note: "A tender story about grief, second chances, and love finding its way into the script.",
    image: "/films/film-5.jpg",
  },
  {
    title: "Sore: Istri dari Masa Depan",
    year: "2025",
    rating: "★★★★★",
    mood: "love against time",
    note: "A love that crosses time, carrying one quiet wish: that the person we cherish gets to stay.",
    image: "/films/film-6.jpg",
  },
]

export const books: Book[] = [
  {
    title: "3726 mdpl",
    author: "Nurwina Sari",
    status: "finished",
    note: "Like mountain air in the lungs—a story of distance, longing, and the roads that lead us home.",
    image: "/books/book-1.jpg",
  },
  {
    title: "Laut Bercerita",
    author: "Leila S. Chudori",
    status: "finished",
    note: "A wound written into history, reminding us that remembering can be its own form of resistance.",
    image: "/books/book-2.jpg",
  },
  {
    title: "0 mdpl",
    author: "Nurwina Sari",
    status: "on-going",
    note: "Still wandering through its pages, one quiet sentence at a time.",
    image: "/books/book-3.jpg",
  },
  {
    title: "Hujan",
    author: "Tere Liye",
    status: "finished",
    note: "A story of memory, loss, and learning that letting go does not mean forgetting.",
    image: "/books/book-4.jpg",
  },
]

export const photos: Photo[] = [
  {
    src: "/photos/photo-1.jpg",
    caption: "a pause the world almost forgot to notice",
    location: "between here and somewhere",
  },

  {
    src: "/photos/photo-4.jpg",
    caption: "light resting gently before it learned to leave",
    location: "the tender hour",
  },
  
  {
    src: "/photos/photo-3.jpg",
    caption: "even ordinary roads become beautiful once they are behind us",
    location: "somewhere along the way",
  },
  {
    src: "/photos/photo-2.jpg",
    caption: "proof that, for one small moment, I was truly here",
    location: "a borrowed escape",
  },
  {
    src: "/photos/photo-5.jpg",
    caption: "sometimes the sky is the answer we were waiting for",
    location: "beneath an open sky",
  },
  {
    src: "/photos/photo-6.jpg",
    caption: "the day saying goodbye in the only language it knows",
    location: "where daylight softens",
  },
]

export const spotifyPlaylists: SpotifyPlaylist[] = [
  {
    title: "songs i wish i could send",
    mood: "for the tender-hearted",
    description: "For late nights, unfinished goodbyes, and feelings that only make sense when someone else sings them.",
    embedUrl: "https://open.spotify.com/embed/playlist/65qBXjMJ3xEgdOiRhGBkGO?theme=0",
  },
]

export const socialLinks: SocialLink[] = [
  {
    label: "spotify",
    url: "https://open.spotify.com/user/31irzovijkcu6jfiyma7ycur4ata?si=915bb7a0f40e46ca",
  },
  {
    label: "instagram",
    url: "https://instagram.com/_aazhariii",
  },
  {
    label: "github",
    url: "https://github.com/kazariii",
  },
  {
    label: "x / twitter",
    url: "https://x.com/kazakazarii",
  },
]
