import { useState, useEffect } from 'react'

// Spotify Web API integration
export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      width: number
      height: number
    }>
  }
  duration_ms: number
  external_urls: {
    spotify: string
  }
}

export interface SpotifyPlaybackState {
  is_playing: boolean
  item: SpotifyTrack | null
  progress_ms: number
  device: {
    id: string
    name: string
    type: string
  } | null
  shuffle_state: boolean
  repeat_state: 'off' | 'track' | 'context'
}

export interface SpotifyDevice {
  id: string
  name: string
  type: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
}

// Spotify API configuration
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'https://agnij.vercel.app/api/auth/spotify/callback'
const HARDCODED_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN || ''

// Debug: Log configuration in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Spotify Configuration:')
  console.log('Client ID:', SPOTIFY_CLIENT_ID)
  console.log('Redirect URI:', SPOTIFY_REDIRECT_URI)
  console.log('Hardcoded Token exists:', !!HARDCODED_ACCESS_TOKEN)
}
const SPOTIFY_SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-position',
  'user-read-email',
  'user-read-private',
  'streaming'
].join(' ')

// Token management
interface SpotifyTokens {
  access_token: string
  refresh_token: string
  expires_at: number
}

// Get tokens from localStorage
function getStoredTokens(): SpotifyTokens | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem('spotify_tokens')
  if (!stored) return null
  
  try {
    const tokens = JSON.parse(stored)
    // Check if tokens are expired
    if (Date.now() >= tokens.expires_at) {
      localStorage.removeItem('spotify_tokens')
      return null
    }
    return tokens
  } catch {
    localStorage.removeItem('spotify_tokens')
    return null
  }
}

// Save tokens to localStorage
function saveTokens(tokens: { access_token: string; refresh_token: string; expires_in: number }) {
  const spotifyTokens: SpotifyTokens = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in * 1000)
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('spotify_tokens', JSON.stringify(spotifyTokens))
  }
}

// Clear tokens
function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('spotify_tokens')
  }
}

// Refresh access token using refresh token
async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens | null> {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`)
    }

    const data = await response.json()
    
    const tokens: SpotifyTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken, // Use new refresh token if provided, otherwise keep the old one
      expires_at: Date.now() + (data.expires_in * 1000)
    }
    
    // Save the new tokens
    saveTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      expires_in: data.expires_in
    })
    
    return tokens
  } catch (error) {
    console.error('Error refreshing token:', error)
    clearTokens()
    return null
  }
}

// Get valid access token (with automatic refresh)
async function getValidToken(): Promise<string | null> {
  // Debug: Check if environment variable is being read
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment variable check:')
    console.log('NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN exists:', !!process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN)
    console.log('HARDCODED_ACCESS_TOKEN exists:', !!HARDCODED_ACCESS_TOKEN)
  }
  
  // First, try to use the hardcoded token if available
  if (HARDCODED_ACCESS_TOKEN) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Using hardcoded access token')
    }
    return HARDCODED_ACCESS_TOKEN
  }
  
  // Fall back to OAuth tokens if no hardcoded token
  const tokens = getStoredTokens()
  
  if (!tokens) {
    // No tokens available, need to authenticate
    if (process.env.NODE_ENV === 'development') {
      console.log('No tokens available, need to authenticate')
    }
    return null
  }
  
  // Check if token is expired or will expire soon (within 5 minutes)
  if (Date.now() >= tokens.expires_at - (5 * 60 * 1000)) {
    // Token expired or will expire soon, refresh it
    if (process.env.NODE_ENV === 'development') {
      console.log('Token expired, refreshing...')
    }
    const newTokens = await refreshAccessToken(tokens.refresh_token)
    return newTokens?.access_token || null
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Using stored OAuth token')
  }
  return tokens.access_token
}

// Spotify API base URL
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

// Make authenticated API request
async function spotifyApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getValidToken()
  if (!token) {
    throw new Error('No valid access token - please authenticate with Spotify')
  }
  
  // Debug: Log the request (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log(`Making Spotify API request to: ${SPOTIFY_API_BASE}${endpoint}`)
    console.log('Token available:', !!token)
    console.log('Token length:', token?.length)
    console.log('Token starts with:', token?.substring(0, 20) + '...')
  }
  
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (response.status === 401) {
    console.error('401 Unauthorized - Token is invalid or expired')
    // If using hardcoded token and it's expired, try OAuth flow
    if (HARDCODED_ACCESS_TOKEN && token === HARDCODED_ACCESS_TOKEN) {
      console.log('Hardcoded token expired, trying OAuth tokens...')
      const tokens = getStoredTokens()
      if (tokens) {
        const newTokens = await refreshAccessToken(tokens.refresh_token)
        if (newTokens) {
          // Retry the request with new token
          const retryResponse = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
            ...options,
            headers: {
              'Authorization': `Bearer ${newTokens.access_token}`,
              'Content-Type': 'application/json',
              ...options.headers,
            },
          })
          
          if (retryResponse.ok) {
            return retryResponse.json()
          }
        }
      }
      // If OAuth also fails, redirect to auth
      throw new Error('Authentication failed - please re-authenticate with Spotify')
    } else {
      // For OAuth tokens, try to refresh
      const tokens = getStoredTokens()
      if (tokens) {
        const newTokens = await refreshAccessToken(tokens.refresh_token)
        if (newTokens) {
          // Retry the request with new token
          const retryResponse = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
            ...options,
            headers: {
              'Authorization': `Bearer ${newTokens.access_token}`,
              'Content-Type': 'application/json',
              ...options.headers,
            },
          })
          
          if (retryResponse.ok) {
            return retryResponse.json()
          }
        }
      }
      throw new Error('Authentication failed - please re-authenticate with Spotify')
    }
  }
  
  if (response.status === 404) {
    console.error('404 Not Found - This usually means the user is not actively playing music')
    // For 404, return null instead of throwing error - this is normal when not playing
    return null
  }
  
  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`)
  }
  
  return response.json()
}

// Test token validity by calling a simple endpoint
export async function testTokenValidity(): Promise<boolean> {
  try {
    const data = await spotifyApiRequest('/me')
    console.log('Token is valid, user profile:', data.display_name)
    console.log('User product:', data.product) // free/premium
    return true
  } catch (error) {
    console.error('Token validation failed:', error)
    return false
  }
}

// Test if token has playback scopes
export async function testPlaybackScopes(): Promise<boolean> {
  try {
    console.log('Testing playback scopes...')
    const data = await spotifyApiRequest('/me/player/devices')
    console.log('Playback scopes test passed, devices:', data.devices?.length || 0)
    return true
  } catch (error) {
    console.error('Playback scopes test failed:', error)
    return false
  }
}

// Get currently playing track
export async function getCurrentlyPlaying(): Promise<SpotifyPlaybackState | null> {
  try {
    console.log('Fetching currently playing track...')
    const data = await spotifyApiRequest('/me/player/currently-playing')
    console.log('Currently playing response:', data)
    return data
  } catch (error) {
    console.error('Error getting currently playing:', error)
    return null
  }
}

// Get playback state
export async function getPlaybackState(): Promise<SpotifyPlaybackState | null> {
  try {
    console.log('Fetching playback state...')
    const data = await spotifyApiRequest('/me/player/currently-playing')
    console.log('Playback state response:', data)
    return data
  } catch (error) {
    console.error('Error getting playback state:', error)
    return null
  }
}

// Get available devices
export async function getAvailableDevices(): Promise<SpotifyDevice[]> {
  try {
    console.log('Fetching available devices...')
    const data = await spotifyApiRequest('/me/player/devices')
    console.log('Available devices:', data.devices)
    return data.devices || []
  } catch (error) {
    console.error('Error getting devices:', error)
    return []
  }
}

// Playback control functions
export async function play(deviceId?: string): Promise<void> {
  const body: any = {}
  if (deviceId) {
    body.device_id = deviceId
  }
  
  await spotifyApiRequest('/me/player/play', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function pause(deviceId?: string): Promise<void> {
  const params = deviceId ? `?device_id=${deviceId}` : ''
  await spotifyApiRequest(`/me/player/pause${params}`, {
    method: 'PUT',
  })
}

export async function skipToNext(deviceId?: string): Promise<void> {
  const params = deviceId ? `?device_id=${deviceId}` : ''
  await spotifyApiRequest(`/me/player/next${params}`, {
    method: 'POST',
  })
}

export async function skipToPrevious(deviceId?: string): Promise<void> {
  const params = deviceId ? `?device_id=${deviceId}` : ''
  await spotifyApiRequest(`/me/player/previous${params}`, {
    method: 'POST',
  })
}

export async function setVolume(volumePercent: number, deviceId?: string): Promise<void> {
  const params = new URLSearchParams({ volume_percent: volumePercent.toString() })
  if (deviceId) {
    params.append('device_id', deviceId)
  }
  
  await spotifyApiRequest(`/me/player/volume?${params}`, {
    method: 'PUT',
  })
}

export async function setShuffle(state: boolean, deviceId?: string): Promise<void> {
  const params = new URLSearchParams({ state: state.toString() })
  if (deviceId) {
    params.append('device_id', deviceId)
  }
  
  await spotifyApiRequest(`/me/player/shuffle?${params}`, {
    method: 'PUT',
  })
}

export async function setRepeatMode(mode: 'off' | 'track' | 'context', deviceId?: string): Promise<void> {
  const params = new URLSearchParams({ state: mode })
  if (deviceId) {
    params.append('device_id', deviceId)
  }
  
  await spotifyApiRequest(`/me/player/repeat?${params}`, {
    method: 'PUT',
  })
}

// Authentication functions
export function getSpotifyAuthUrl(): string {
  const state = Math.random().toString(36).substring(7)
  
  // Build the authorization URL manually to ensure it's correct
  const baseUrl = 'https://accounts.spotify.com/authorize'
  const params = new URLSearchParams()
  params.append('response_type', 'code')
  params.append('client_id', SPOTIFY_CLIENT_ID)
  params.append('scope', SPOTIFY_SCOPES)
  params.append('redirect_uri', SPOTIFY_REDIRECT_URI)
  params.append('state', state)
  
  const authUrl = `${baseUrl}?${params.toString()}`
  
  // Debug: Log the authorization URL
  if (process.env.NODE_ENV === 'development') {
    console.log('=== SPOTIFY AUTH DEBUG ===')
    console.log('Base URL:', baseUrl)
    console.log('Client ID:', SPOTIFY_CLIENT_ID)
    console.log('Redirect URI:', SPOTIFY_REDIRECT_URI)
    console.log('Scopes:', SPOTIFY_SCOPES)
    console.log('State:', state)
    console.log('Final Auth URL:', authUrl)
    console.log('========================')
  }
  
  return authUrl
}

export function isAuthenticated(): boolean {
  // Check if we have a hardcoded token first
  if (HARDCODED_ACCESS_TOKEN) {
    return true
  }
  
  // Fall back to checking OAuth tokens
  const tokens = getStoredTokens()
  return tokens !== null
}

export function logout(): void {
  clearTokens()
}

// Hook for real-time playback updates with lazy loading and error handling
export function useSpotifyPlayback(intervalMs: number = 10000) {
  const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(0)
  
  useEffect(() => {
    if (!isAuthenticated()) {
      setError('Not authenticated with Spotify')
      return
    }
    
    let intervalId: NodeJS.Timeout
    let retryCount = 0
    const maxRetries = 3
    
    const updatePlaybackState = async () => {
      // Prevent multiple simultaneous requests
      if (isLoading) return
      
      // Throttle requests - don't make requests too frequently
      const now = Date.now()
      if (now - lastUpdate < 5000) return // Minimum 5 seconds between requests
      
      setIsLoading(true)
      setError(null)
      
      try {
        // First, test if the token is valid
        const isTokenValid = await testTokenValidity()
        if (!isTokenValid) {
          setError('Invalid or expired token - please re-authenticate')
          return
        }
        
        // Test if token has playback scopes
        const hasPlaybackScopes = await testPlaybackScopes()
        if (!hasPlaybackScopes) {
          setError('Token missing playback scopes - please re-authenticate with proper permissions')
          return
        }
        
        // Check available devices
        const devices = await getAvailableDevices()
        console.log('Active devices:', devices.filter(d => d.is_active))
        
        const state = await getPlaybackState()
        setPlaybackState(state)
        setLastUpdate(now)
        retryCount = 0 // Reset retry count on success
      } catch (error) {
        console.error('Error updating playback state:', error)
        retryCount++
        
        if (retryCount >= maxRetries) {
          setError(error instanceof Error ? error.message : 'Failed to get playback state')
          // Stop making requests after max retries
          if (intervalId) {
            clearInterval(intervalId)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    // Initial update with delay to prevent immediate spam
    const initialTimeout = setTimeout(updatePlaybackState, 1000)
    
    // Set up interval with longer intervals to reduce API calls
    intervalId = setInterval(updatePlaybackState, intervalMs)
    
    return () => {
      clearTimeout(initialTimeout)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalMs, isLoading, lastUpdate])
  
  return { playbackState, isLoading, error }
} 