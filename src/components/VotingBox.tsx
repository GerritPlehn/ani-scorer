import { Media } from "@/types/anilist";
import { MediaCard } from "./MediaCard";
export const VotingBox = ({media1, media2}: {media1: Media, media2: Media}) => {
  function castVote (id: Media['id']) {
    console.log(`${id} won`)
    return id
  }



  return (
    <div>
      <div onClick={() => castVote(media1.id)}>
        <MediaCard media={media1}/>
      </div>
      <div onClick={() => castVote(media2.id)}>
        <MediaCard media={media2}/>
      </div>
    </div>
  )
}
