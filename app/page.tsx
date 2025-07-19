"use client"

import { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { MainContent } from "../components/MainContent"
import { PlayerControls } from "../components/PlayerControls"
import { RightSidebar } from "../components/RightSidebar"

export default function Home() {
  const [activeSection, setActiveSection] = useState("Education")
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <MainContent activeSection={activeSection} />
        <RightSidebar isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} setActiveSection={setActiveSection} />
      </div>
      <PlayerControls 
        onToggleRightSidebar={toggleRightSidebar}
        isRightSidebarOpen={isRightSidebarOpen}
      />
    </div>
  )
}
