import { NextRequest, NextResponse } from 'next/server'

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json()

    if (!refresh_token) {
      return NextResponse.json({ error: 'Refresh token is required' }, { status: 400 })
    }

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Spotify credentials not configured' }, { status: 500 })
    }

    // Create the authorization header
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Spotify token refresh failed:', data)
      return NextResponse.json({ error: data.error_description || data.error }, { status: response.status })
    }

    console.log('Successfully refreshed Spotify token')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error refreshing Spotify token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 