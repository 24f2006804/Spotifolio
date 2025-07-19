import { Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2, User } from "lucide-react"
import Image from "next/image"

interface PlayerControlsProps {
  onToggleRightSidebar: () => void
  isRightSidebarOpen: boolean
}

export function PlayerControls({ onToggleRightSidebar, isRightSidebarOpen }: PlayerControlsProps) {
  return (
    <div className="bg-black text-white p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Now playing info */}
      <div className="flex items-center space-x-4 mb-3 md:mb-0">
        <Image
          src="/placeholder.svg?height=56&width=56"
          width={56}
          height={56}
          alt="Now playing"
          className="w-12 h-12 md:w-14 md:h-14"
        />
        <div>
          <p className="font-semibold text-sm md:text-base">Currently Working On</p>
          <p className="text-xs md:text-sm text-gray-400">Next.js Portfolio Site</p>
        </div>
      </div>

      {/* Player controls - simplified on mobile */}
      <div className="flex flex-col items-center md:flex-1 md:mx-4">
        <div className="flex items-center space-x-4 md:space-x-6">
          <Shuffle size={18} className="hidden md:block text-gray-400 hover:text-white" />
          <SkipBack size={18} className="text-gray-400 hover:text-white" />
          <button className="bg-white text-black rounded-full p-1.5 md:p-2 hover:scale-105 transition">
            <Play fill="currentColor" size={18} />
          </button>
          <SkipForward size={18} className="text-gray-400 hover:text-white" />
          <Repeat size={18} className="hidden md:block text-gray-400 hover:text-white" />
        </div>
        <div className="w-full max-w-md mt-2">
          <div className="bg-gray-500 rounded-full h-1 w-full">
            <div className="bg-white rounded-full h-1 w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Volume control and right sidebar toggle */}
      <div className="hidden md:flex items-center space-x-4">
        <Volume2 size={18} className="text-gray-400 hover:text-white" />
        <div className="bg-gray-500 rounded-full h-1 w-24">
          <div className="bg-white rounded-full h-1 w-3/4"></div>
        </div>
        <button
          onClick={onToggleRightSidebar}
          className={`p-2 rounded hover:bg-[#1F1F1F] transition-colors ${
            isRightSidebarOpen ? "bg-[#1F1F1F] text-white" : "text-gray-400"
          }`}
          title="About the Artist"
        >
          <User size={18} />
        </button>
      </div>
    </div>
  )
}
