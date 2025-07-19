"use client"

import { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { MainContent } from "../components/MainContent"
import { PlayerControls } from "../components/PlayerControls"
import { RightSidebar } from "../components/RightSidebar"
import { TopBar } from "../components/TopBar"

export default function Home() {
  const [activeSection, setActiveSection] = useState("Education")
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative gap-2 p-2">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isRightSidebarOpen ? 'mr-96' : 'mr-0'}`}>
          <MainContent activeSection={activeSection} />
        </div>
        <RightSidebar isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} setActiveSection={setActiveSection} />
      </div>
      <PlayerControls 
        onToggleRightSidebar={toggleRightSidebar}
        isRightSidebarOpen={isRightSidebarOpen}
      />
    </div>
  )
}
