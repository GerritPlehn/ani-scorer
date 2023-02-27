import { MediaList } from '@/types/anilist'
import { signIn, signOut, useSession } from 'next-auth/react'
import { VotingBox } from '@/components/VotingBox'
import { useState } from 'react'

const Index = () => {
  const { data: session } = useSession()
  const [media, setMedia] = useState<MediaList>()

  const getMedia = async (params: { token?: string; userId: number }) => {
    const media = await getList(params)
    setMedia(media)
  }

  return (
    <div>
      {!session && <button onClick={() => signIn()}> Sign in with Anilist</button>}
      {session && (
        <div>
          <button onClick={() => signOut()}>Sign out ({session.user?.name})</button>

          <button onClick={() => getMedia({ token: session.accessToken, userId: session.user.id })}>
            Get WatchList
          </button>
          {!media ? null : <VotingBox media1={media[0].media} media2={media[1].media} />}
        </div>
      )}
    </div>
  )
}

const apiUrl = 'https://graphql.anilist.co'

const query = `
query ($page: Int, $userId: Int, $type: MediaType, $status: MediaListStatus ) {
  Page (page: $page, perPage: 100) {
    pageInfo {
      hasNextPage
    }
    mediaList (status: $status, type: $type, userId: $userId) {
      status
      score(format: POINT_100)
      media {
        siteUrl
        id
        coverImage{
          large
          extraLarge
        }
        title {
          userPreferred
        }
      }
    }
  }
}
`

const getList = async (params: { token?: string; userId?: number; page?: number }): Promise<MediaList> => {
  let { userId, token, page } = params
  if (!page) {
    page = 1
  }
  if (!token || !userId) {
    throw new Error('Not logged in')
  }

  const animes: MediaList = []

  const variables = {
    page,
    userId: userId,
    type: 'ANIME',
    status: 'COMPLETED',
    sort: null,
  }

  const listRequest = await fetch(apiUrl, {
    body: JSON.stringify({
      query,
      variables,
    }),
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const listResponse = await listRequest.json()

  animes.push(...listResponse.data.Page.mediaList)
  if (listResponse.data.Page.pageInfo.hasNextPage) {
    page++
    animes.push(...(await getList({ userId, token, page })))
  }
  console.log(animes)
  return animes
}

export default Index
