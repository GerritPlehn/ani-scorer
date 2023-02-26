import NextAuth, { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    {
      id: 'anilist',
      name: 'Anilist',
      type: 'oauth',
      authorization: {
        url: `https://anilist.co/api/v2/oauth/authorize`,
        params: {
          client_id: process.env.CLIENT_ID,
          redirect_uri: 'http://localhost:3000/api/auth/callback/anilist',
          response_type: 'code',
          scope: '',
        },
      },
      token: {
        url: 'https://anilist.co/api/v2/oauth/token',
      },
      userinfo: {
        url: 'https://graphql.anilist.co',
        async request({ tokens, client, provider }) {
          const query = `
          {
            Viewer {
              id
              name
              avatar {
                large
              }
            }
          }
          `
          const variables = {}

          return client.userinfo(tokens.access_token!, {
            method: 'POST',
            params: { query, variables },
          })
        },
      },
      profile(profile) {
        const viewer = profile.data.Viewer
        return {
          id: viewer.id,
          name: viewer.name,
          email: 'foo',
          image: viewer.avatar,
        }
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.id = profile?.data.Viewer.id
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = String(token.accessToken)
      session.user.id = Number(token.id)
      return session
    },
  },
}

export default NextAuth(authOptions)
