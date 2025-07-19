"use client"

import { useState } from "react"
import { Home, Search, Library, PlusSquare, Heart, Download, Menu, X } from "lucide-react"
import { 
  FaCode, 
  FaGraduationCap, 
  FaBriefcase, 
  FaBrain, 
  FaGlobe, 
  FaEthereum, 
  FaTools, 
  FaGithub 
} from "react-icons/fa"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateResume } from "../utils/resumeGenerator"

const portfolioSections = [
  { name: "Education", icon: FaGraduationCap, gradient: "from-blue-500 to-blue-700" },
  { name: "Work Experience", icon: FaBriefcase, gradient: "from-green-500 to-green-700" },
  { name: "AI Projects", icon: FaBrain, gradient: "from-purple-500 to-purple-700" },
  { name: "Web Projects", icon: FaGlobe, gradient: "from-orange-500 to-orange-700" },
  { name: "Blockchain Projects", icon: FaEthereum, gradient: "from-yellow-500 to-yellow-700" },
  { name: "Skills & Tools", icon: FaTools, gradient: "from-red-500 to-red-700" },
  { name: "Open Source", icon: FaGithub, gradient: "from-pink-500 to-pink-700" },
  { name: "Contact", icon: FaCode, gradient: "from-teal-500 to-teal-700" },
]

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev)
  }

  const navSections = [
    { name: "Home", icon: Home },
    { name: "Search", icon: Search },
    { name: "Your Library", icon: Library },
  ]
  const actionSections = [
    { name: "Create Playlist", icon: PlusSquare },
    { name: "Liked Songs", icon: Heart },
  ]

  const sidebarItems = [
    ...navSections,
    ...actionSections,
    { type: 'label', name: 'Portfolio' },
    ...portfolioSections.map(section => ({ ...section, isPortfolio: true })),
    { type: 'download', name: 'Download Resume', icon: Download },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-black/80 p-2 rounded-full"
      >
        {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
      </button>
  
      {/* Sidebar container */}
      <div
        className={`
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-all duration-300
          fixed md:relative z-40
          ${collapsed ? "w-16" : "w-60"}
          bg-black text-gray-300 flex flex-col h-screen
        `}
      >
        {/* Header */}
        <div className={`p-6 ${collapsed ? "px-2 py-4" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            {!collapsed && <h1 className="text-2xl font-bold text-white">Portfolio</h1>}
            <button onClick={toggleCollapsed} className="p-1 hover:bg-gray-800 rounded-full">
              {collapsed ? <Menu size={20} className="text-white" /> : <X size={20} className="text-white" />}
            </button>
          </div>
  
          {/* Primary nav */}
          <ScrollArea className="flex-1">
            <ul className={`flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}> 
              {sidebarItems.map((item, idx) => {
                if ('type' in item && item.type === 'label') {
                  return !collapsed ? (
                    <li key={item.name} className="sticky top-0 z-10 bg-black pt-6 pb-2 px-3">
                      <h2 className="text-sm uppercase font-semibold">{item.name}</h2>
                    </li>
                  ) : null
                }
                const isPortfolio = 'isPortfolio' in item && item.isPortfolio
                const Icon = 'icon' in item ? item.icon : undefined
                const isActive = activeSection === item.name
                const isContact = item.name === "Contact"
                const isDownload = 'type' in item && item.type === 'download'
                const baseClasses = `w-full flex items-center gap-x-4 px-3 py-2 rounded-lg transition-all font-medium text-left justify-start`;
                const collapsedClasses = collapsed ? "justify-center px-2" : ""
                const activeGradient = isPortfolio ? `bg-gradient-to-r ${'gradient' in item ? item.gradient : ''} text-white shadow-md` : "bg-gray-800 text-white"
                const inactiveGradient = isPortfolio ? "text-white/80 hover:bg-gray-800" : "text-white/80 hover:bg-gray-800"
                const contactClasses = isActive ? "bg-teal-500 text-white" : "text-teal-500 hover:bg-teal-500/10"
                const downloadClasses = isDownload ? "hover:bg-gray-800 text-white/80" : ""
                return (
                  <li key={item.name} className={collapsed ? "flex justify-center" : ""}>
                    <button
                      onClick={() => {
                        if (isPortfolio) {
                          setActiveSection(item.name)
                          if (mobileMenuOpen) setMobileMenuOpen(false)
                        } else if (isDownload) {
                          generateResume()
                        }
                      }}
                      className={
                        `${baseClasses} ` +
                        (isDownload
                          ? downloadClasses
                          : isContact
                          ? contactClasses
                          : isActive
                          ? activeGradient
                          : inactiveGradient
                        ) +
                        ` ${collapsedClasses}`
                      }
                      style={{ minHeight: 44, width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
                    >
                      {Icon && (
                        <span className="w-7 flex-shrink-0 flex items-center justify-center">
                          <Icon size={20} />
                        </span>
                      )}
                      {!collapsed && item.name !== 'Portfolio' && (
                        <span className={`whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </div>
  
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </>
  )
  
}
