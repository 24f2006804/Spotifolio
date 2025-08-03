// Spotify Token Refresh System
// This handles automatic token refresh to maintain permanent access

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''

// Token storage keys
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  EXPIRES_AT: 'spotify_token_expires_at'
}

// Get stored tokens
export function getStoredTokens() {
  if (typeof window === 'undefined') return null
  
  const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
  const expiresAt = localStorage.getItem(TOKEN_KEYS.EXPIRES_AT)
  
  return {
    accessToken,
    refreshToken,
    expiresAt: expiresAt ? parseInt(expiresAt) : null
  }
}

// Save tokens to storage
export function saveTokens(accessToken: string, refreshToken: string, expiresIn: number) {
  if (typeof window === 'undefined') return
  
  const expiresAt = Date.now() + (expiresIn * 1000)
  
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken)
  localStorage.setItem(TOKEN_KEYS.EXPIRES_AT, expiresAt.toString())
}

// Check if token is expired
export function isTokenExpired(): boolean {
  const tokens = getStoredTokens()
  if (!tokens || !tokens.expiresAt) return true
  
  // Add 5 minute buffer to refresh before actual expiry
  return Date.now() >= (tokens.expiresAt - 300000)
}

// Refresh access token using refresh token
export async function refreshAccessToken(): Promise<string | null> {
  const tokens = getStoredTokens()
  if (!tokens?.refreshToken) {
    console.error('No refresh token available')
    return null
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokens.refreshToken
      })
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`)
    }

    const data = await response.json()
    
    // Save the new tokens
    saveTokens(
      data.access_token,
      data.refresh_token || tokens.refreshToken, // Use new refresh token if provided, otherwise keep old one
      data.expires_in
    )

    console.log('Successfully refreshed Spotify access token')
    return data.access_token
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return null
  }
}

// Get a valid access token (refresh if needed)
export async function getValidAccessToken(): Promise<string | null> {
  // Check if we have a valid token
  if (!isTokenExpired()) {
    const tokens = getStoredTokens()
    return tokens?.accessToken || null
  }

  // Token is expired, try to refresh
  console.log('Access token expired, refreshing...')
  return await refreshAccessToken()
}

// Initialize with your current tokens
export function initializeWithTokens(accessToken: string, refreshToken: string, expiresIn: number = 3600) {
  saveTokens(accessToken, refreshToken, expiresIn)
  console.log('Spotify tokens initialized successfully')
}

// Clear all tokens
export function clearTokens() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(TOKEN_KEYS.EXPIRES_AT)
  console.log('Spotify tokens cleared')
} 