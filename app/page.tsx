"use client"

import { useState, useEffect, Suspense } from "react"
import { Sidebar } from "../components/Sidebar"
import { MainContent } from "../components/MainContent"
import { PlayerControls } from "../components/PlayerControls"
import { RightSidebar } from "../components/RightSidebar"
import { TopBar } from "../components/TopBar"
import { useSearchParams } from "next/navigation"

const DEFAULT_SECTION = "Education"

// Component that handles Spotify token processing
function SpotifyTokenHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const expiresIn = searchParams.get('expires_in')

    if (accessToken && refreshToken && expiresIn) {
      
      // Save tokens to localStorage in the new format
      const tokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Date.now() + parseInt(expiresIn) * 1000
      }
      localStorage.setItem('spotify_tokens', JSON.stringify(tokens))
      
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [searchParams])

  return null
}

export default function Home() {
  const [history, setHistory] = useState([DEFAULT_SECTION])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [activeSection, setActiveSectionState] = useState(DEFAULT_SECTION)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(240)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(384)

  // Custom setActiveSection that manages history
  const setActiveSection = (section: string) => {
    if (section === activeSection) return
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(section)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setActiveSectionState(section)
  }

  // Go back in history
  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setActiveSectionState(history[newIndex])
    }
  }

  // Go forward in history
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setActiveSectionState(history[newIndex])
    }
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }
  const openRightSidebar = () => setIsRightSidebarOpen(true)

  return (
    <div className="flex flex-col h-screen bg-black">
      <Suspense fallback={null}>
        <SpotifyTokenHandler />
      </Suspense>
      <TopBar onBack={goBack} onForward={goForward} canGoBack={historyIndex > 0} canGoForward={historyIndex < history.length - 1} setActiveSection={setActiveSection} />
      <div className="flex flex-1 overflow-hidden relative gap-2 px-2">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          width={leftSidebarWidth}
          setWidth={setLeftSidebarWidth}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300`} style={{ marginRight: isRightSidebarOpen ? rightSidebarWidth + 8 : 0 }}>
          <MainContent activeSection={activeSection} setActiveSection={setActiveSection} onOpenRightSidebar={openRightSidebar} />
        </div>
        <RightSidebar 
          isOpen={isRightSidebarOpen} 
          onClose={() => setIsRightSidebarOpen(false)} 
          setActiveSection={setActiveSection}
          width={rightSidebarWidth}
          setWidth={setRightSidebarWidth}
        />
      </div>
      <div className="px-2 pb-2">
        <PlayerControls 
          onToggleRightSidebar={toggleRightSidebar}
          isRightSidebarOpen={isRightSidebarOpen}
        />
      </div>
    </div>
  )
}
