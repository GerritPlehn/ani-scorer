import { Media } from '@/types/anilist'

export const MediaCard = ({ media }: { media: Media }) => {
  return (
    <div>
      <p className="title">{media.title.userPreferred}</p>
      <img src={media.coverImage.large} alt={`${media.title.userPreferred} Cover Image`} />
    </div>
  )
}
