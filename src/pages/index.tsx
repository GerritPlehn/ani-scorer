import { signIn, signOut, useSession } from 'next-auth/react'

const Index = () => {
  const { data: session } = useSession()

  return (
    <div>
      {!session && <button onClick={() => signIn()}> Sign in with Anilist</button>}
      {session && (
        <div>
          <button onClick={() => signOut()}>Sign out ({session.user?.name})</button>

          <button onClick={() => getList({ token: session.accessToken, userId: session.user.id })}>
            Get WatchList
          </button>
          <div>({JSON.stringify(session)})</div>
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
      progress
      progressVolumes
      notes
      media {
        siteUrl
        id
        idMal
        episodes
        chapters
        volumes
        status
        averageScore
        coverImage{
          large
          extraLarge
        }
        bannerImage
        title {
          userPreferred
        }
      }
    }
  }
}
`

const getList = async (params: { token?: string; userId?: number }) => {
  const { userId, token } = params
  if (!token || !userId) {
    console.error('Not logged in')
    return
  }

  const variables = {
    page: 1,
    userId: userId,
    type: 'ANIME',
    status: 'COMPLETED',
    sort: null,
  }

  console.log(typeof variables.userId)

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
  console.log(listResponse)
  return listRequest
}

export default Index
