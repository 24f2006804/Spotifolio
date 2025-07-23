"use client"

import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface TopBarProps {
  onBack?: () => void
  onForward?: () => void
  canGoBack?: boolean
  canGoForward?: boolean
}

export function TopBar({ onBack, onForward, canGoBack = true, canGoForward = true }: TopBarProps) {
  return (
    <div className="bg-black px-6 py-3 flex items-center justify-between">
      {/* Navigation buttons - extreme left */}
      <div className="flex items-center gap-2">
        <button
          className={`w-8 h-8 'bg-gray-700 cursor-not-allowed'}`}
          onClick={canGoBack ? onBack : undefined}
          disabled={!canGoBack}
        >
          <ChevronLeft size={20} className={canGoBack ? "text-white" : "text-gray-400"} />
        </button>
        <button
          className={`w-8 h-8 'bg-gray-700 cursor-not-allowed'}`}
          onClick={canGoForward ? onForward : undefined}
          disabled={!canGoForward}
        >
          <ChevronRight size={20} className={canGoForward ? "text-white" : "text-gray-400"} />
        </button>
      </div>
      
      {/* Search bar - centered */}
      <div className="flex-1 flex justify-center max-w-md">
        <div className="relative w-full">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for Artists, Songs, or Playlists"
            className="w-full bg-[#1F1F1F] text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
      </div>
      
      {/* Right side - empty for balance */}
      <div className="w-20"></div>
    </div>
  )
} 