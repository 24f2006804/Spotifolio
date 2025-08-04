"use client"

import { Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2, User, Pause, Music } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { 
  useSpotifyPlayback, 
  play, 
  pause, 
  skipToNext, 
  skipToPrevious, 
  setVolume, 
  setShuffle, 
  setRepeatMode,
  isAuthenticated,
  getSpotifyAuthUrl,
  logout
} from "../lib/spotify"

interface PlayerControlsProps {
  onToggleRightSidebar: () => void
  isRightSidebarOpen: boolean
}

export function PlayerControls({ onToggleRightSidebar, isRightSidebarOpen }: PlayerControlsProps) {
  const { playbackState, isLoading, error } = useSpotifyPlayback(3000)
  const [volume, setVolumeState] = useState(50)

  const handlePlayPause = async () => {
    if (!isAuthenticated()) {
      // Only redirect to auth if we don't have a hardcoded token
      const hardcodedToken = process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN
      if (!hardcodedToken) {
        window.location.href = getSpotifyAuthUrl()
      }
      return
    }

    if (playbackState?.is_playing) {
      await pause()
    } else {
      await play()
    }
  }

  const handleSkipNext = async () => {
    await skipToNext()
  }

  const handleSkipPrevious = async () => {
    await skipToPrevious()
  }

  const handleVolumeChange = async (newVolume: number) => {
    setVolumeState(newVolume)
    await setVolume(newVolume)
  }

  const handleShuffle = async () => {
    if (playbackState) {
      await setShuffle(!playbackState.shuffle_state)
    }
  }

  const handleRepeat = async () => {
    if (playbackState) {
      const currentMode = playbackState.repeat_state
      const nextMode = currentMode === 'off' ? 'context' : currentMode === 'context' ? 'track' : 'off'
      await setRepeatMode(nextMode)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!playbackState?.item) return 0
    return (playbackState.progress_ms / playbackState.item.duration_ms) * 100
  }

  return (
    <div className="bg-black text-white p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Now playing info */}
      <div className="flex items-center space-x-4 mb-3 md:mb-0">
        {playbackState?.item ? (
          <>
            <Image
              src={playbackState.item.album.images[0]?.url || "/placeholder.svg?height=56&width=56"}
              width={56}
              height={56}
              alt="Now playing"
              className="w-12 h-12 md:w-14 md:h-14 rounded"
            />
            <div>
              <p className="font-semibold text-sm md:text-base truncate max-w-48">
                {playbackState.item.name}
              </p>
              <p className="text-xs md:text-sm text-gray-400 truncate max-w-48">
                {playbackState.item.artists.map(a => a.name).join(', ')}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-800 rounded flex items-center justify-center">
              <Music size={20} className="text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-sm md:text-base">
                {error ? 'Spotify Unavailable' : 'Not Playing'}
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                {error ? 'Authentication error' : 'Start playing music to see it here'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Player controls - simplified on mobile */}
      <div className="flex flex-col items-center md:flex-1 md:mx-4">
        <div className="flex items-center space-x-4 md:space-x-6">
          <button 
            onClick={handleShuffle}
            className={`hidden md:block ${playbackState?.shuffle_state ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Shuffle size={18} />
          </button>
          <button 
            onClick={handleSkipPrevious}
            className="text-gray-400 hover:text-white"
          >
            <SkipBack size={18} />
          </button>
          <button 
            onClick={handlePlayPause}
            className="bg-white text-black rounded-full p-1.5 md:p-2 hover:scale-105 transition"
          >
            {playbackState?.is_playing ? (
              <Pause fill="currentColor" size={18} />
            ) : (
              <Play fill="currentColor" size={18} />
            )}
          </button>
          <button 
            onClick={handleSkipNext}
            className="text-gray-400 hover:text-white"
          >
            <SkipForward size={18} />
          </button>
          <button 
            onClick={handleRepeat}
            className={`hidden md:block ${playbackState?.repeat_state !== 'off' ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Repeat size={18} />
          </button>
        </div>
        <div className="w-full max-w-md mt-2">
          <div className="bg-gray-500 rounded-full h-1 w-full">
            <div 
              className="bg-white rounded-full h-1 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          {playbackState?.item && (
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(playbackState.progress_ms)}</span>
              <span>{formatTime(playbackState.item.duration_ms)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Volume control and right sidebar toggle */}
      <div className="hidden md:flex items-center space-x-4">
        <Volume2 size={18} className="text-gray-400 hover:text-white" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
          className="w-24 h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, white 0%, white ${volume}%, #6b7280 ${volume}%, #6b7280 100%)`
          }}
        />
        <button
          onClick={onToggleRightSidebar}
          className={`p-2 rounded hover:bg-[#1F1F1F] transition-colors ${
            isRightSidebarOpen ? "bg-[#1F1F1F] text-white" : "text-gray-400"
          }`}
          title="About the Artist"
        >
          <User size={18} />
        </button>
        <button
          onClick={() => window.open('https://open.spotify.com', '_blank')}
          className="p-2 rounded hover:bg-[#1F1F1F] transition-colors text-gray-400 hover:text-white"
          title="Open Spotify"
        >
          <Music size={18} />
        </button>
      </div>
    </div>
  )
}
