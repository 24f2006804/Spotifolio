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
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://192.168.0.104:3000/api/auth/spotify/callback'
const SPOTIFY_SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-position',
  'user-read-email',
  'user-read-private'
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
  const tokens = getStoredTokens()
  
  if (!tokens) {
    // No tokens available, need to authenticate
    return null
  }
  
  // Check if token is expired or will expire soon (within 5 minutes)
  if (Date.now() >= tokens.expires_at - (5 * 60 * 1000)) {
    // Token expired or will expire soon, refresh it
    const newTokens = await refreshAccessToken(tokens.refresh_token)
    return newTokens?.access_token || null
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

// Authentication functions
export function getSpotifyAuthUrl(): string {
  const state = Math.random().toString(36).substring(7)
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state,
  })
  
  return `https://accounts.spotify.com/authorize?${params}`
}

export function isAuthenticated(): boolean {
  const tokens = getStoredTokens()
  return tokens !== null
}

export function logout(): void {
  clearTokens()
}

// Hook for real-time playback updates
export function useSpotifyPlayback(intervalMs: number = 3000) {
  const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!isAuthenticated()) {
      setError('Not authenticated with Spotify')
      return
    }
    
    let intervalId: NodeJS.Timeout
    
    const updatePlaybackState = async () => {
      if (isLoading) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const state = await getPlaybackState()
        setPlaybackState(state)
      } catch (error) {
        console.error('Error updating playback state:', error)
        setError(error instanceof Error ? error.message : 'Failed to get playback state')
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
  
  return { playbackState, isLoading, error }
} 