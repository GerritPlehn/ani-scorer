export type MediaList = {
  score: number
  status: string
  media: Media
}[]

export type Media = {
  siteUrl: string
  id: number
  coverImage: {
    large: string
    extraLarge: string
  }
  title: {
    userPreferred: string
  }
}
