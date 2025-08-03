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

// Spotify API configuration - Read from environment variables
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''
const SPOTIFY_REDIRECT_URI = 'http://localhost:3000/api/auth/spotify/callback'
const SPOTIFY_SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-position',
  'user-read-email',
  'user-read-private'
].join(' ')

// Your access token from environment variable
const HARDCODED_ACCESS_TOKEN = process.env.SPOTIFY_ACCESS_TOKEN || ''

// Token management - Always use hardcoded token
let accessToken: string | null = HARDCODED_ACCESS_TOKEN
let refreshToken: string | null = null
let tokenExpiry: number = Date.now() + (3600 * 1000) // 1 hour from now

// Save tokens to localStorage (not used with hardcoded token)
function saveTokens(token: string, refresh: string, expiry: number) {
  // Do nothing - we always use the hardcoded token
}

// Clear tokens (not used with hardcoded token)
function clearTokens() {
  // Do nothing - we always use the hardcoded token
}

// Check if token is expired
function isTokenExpired(): boolean {
  return Date.now() >= tokenExpiry
}

// Refresh access token (not used with hardcoded token)
async function refreshAccessToken(): Promise<boolean> {
  // For now, just return true since we're using a hardcoded token
  // In production, you'd want to implement proper token refresh
  return true
}

// Get valid access token
async function getValidToken(): Promise<string | null> {
  // Always return the hardcoded token
  return HARDCODED_ACCESS_TOKEN
}

// Spotify API base URL
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

// Make authenticated API request
async function spotifyApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getValidToken()
  if (!token) {
    throw new Error('No valid access token')
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
    // Token expired, try to refresh
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      // Retry the request
      const newToken = await getValidToken()
      const retryResponse = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      
      if (retryResponse.ok) {
        return retryResponse.json()
      }
    }
    throw new Error('Authentication failed')
  }
  
  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`)
  }
  
  return response.json()
}

// Get currently playing track
export async function getCurrentlyPlaying(): Promise<SpotifyPlaybackState | null> {
  try {
    const data = await spotifyApiRequest('/me/player/currently-playing')
    return data
  } catch (error) {
    console.error('Error getting currently playing:', error)
    return null
  }
}

// Get playback state
export async function getPlaybackState(): Promise<SpotifyPlaybackState | null> {
  try {
    const data = await spotifyApiRequest('/me/player')
    return data
  } catch (error) {
    console.error('Error getting playback state:', error)
    return null
  }
}

// Get available devices
export async function getAvailableDevices(): Promise<SpotifyDevice[]> {
  try {
    const data = await spotifyApiRequest('/me/player/devices')
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

// Authentication functions (not used with hardcoded token)
export function getSpotifyAuthUrl(): string {
  // Not used since we have a hardcoded token
  return ''
}

export function isAuthenticated(): boolean {
  // Always return true since we have a hardcoded token
  return true
}

export function logout(): void {
  // Not used since we have a hardcoded token
}

// Hook for real-time playback updates
export function useSpotifyPlayback(intervalMs: number = 3000) {
  const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (!isAuthenticated()) return
    
    let intervalId: NodeJS.Timeout
    
    const updatePlaybackState = async () => {
      if (isLoading) return
      
      setIsLoading(true)
      try {
        const state = await getPlaybackState()
        setPlaybackState(state)
      } catch (error) {
        console.error('Error updating playback state:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Initial update
    updatePlaybackState()
    
    // Set up interval
    intervalId = setInterval(updatePlaybackState, intervalMs)
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalMs, isLoading])
  
  return { playbackState, isLoading }
} 