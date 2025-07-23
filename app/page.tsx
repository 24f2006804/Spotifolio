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
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(240) // 60 * 4 = 240px (w-60)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(384) // 96 * 4 = 384px (w-96)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative gap-2 px-2">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          width={leftSidebarWidth}
          setWidth={setLeftSidebarWidth}
        />
                <div className={`flex-1 flex flex-col transition-all duration-300`} style={{ marginRight: isRightSidebarOpen ? rightSidebarWidth + 8 : 0 }}>
        <MainContent activeSection={activeSection} />
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
