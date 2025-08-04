import { NextRequest, NextResponse } from 'next/server'

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''
const SPOTIFY_REDIRECT_URI = 'http://192.168.0.104:3000/api/auth/spotify/callback'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', tokenResponse.status, errorData)
      throw new Error(`Token exchange failed: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()

    // Redirect to frontend with tokens
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('access_token', tokenData.access_token)
    redirectUrl.searchParams.set('refresh_token', tokenData.refresh_token)
    redirectUrl.searchParams.set('expires_in', tokenData.expires_in.toString())

    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url))
  }
} 