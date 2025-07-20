"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight } from "lucide-react"

interface RightSidebarProps {
  isOpen: boolean
  onClose: () => void
  setActiveSection?: (section: string) => void
  width: number
  setWidth: (width: number) => void
}

export function RightSidebar({ isOpen, onClose, setActiveSection, width, setWidth }: RightSidebarProps) {
  const [hovered, setHovered] = useState(false)
  if (!isOpen) return null

  const aboutData = {
    name: "Agnij Dutta",
    tagline: "Building meaningful things with code.",
    backgroundImage: "https://github.com/agnij-dutta/agnij-dutta/blob/main/background-mic.jpeg?raw=true",
    avatar: "https://avatars.githubusercontent.com/u/126397667?v=4",
    bio: "In the realm of technologies and innovation, where code weaves enchanting solutions, there exists a young developer named Agnij Dutta. His heart, like a dedicated processor, beats with the rhythm of continuous learning and growth.",
    education: {
      title: "BS Data Science and Applications",
      institute: "Indian Institute of Technology, Madras",
      year: "Expected 2028",
      major: "Data Science | Machine Learning"
    },
    workExperiences: [
      {
        date: "2025",
        title: "SDE Intern",
        company: "Workwise",
        description: "Built features to boost admin productivity by 85%"
      },
      {
        date: "2024", 
        title: "Developer Advocate",
        company: "HackQuest",
        description: "Community growth and maintenance"
      },
      {
        date: "2023",
        title: "Data Science Intern", 
        company: "Project Control & Systems",
        description: "Increased customer retention by 20%"
      }
    ]
  }

  // Handler for credits card/follow button click
  const goToEducation = () => {
    if (setActiveSection) setActiveSection("Education")
    else window.location.hash = "#Education"
  }

  // Handler for on tour section click
  const goToWorkExperience = () => {
    if (setActiveSection) setActiveSection("Work Experience")
    else window.location.hash = "#Work Experience"
  }

  return (
    <div
      className="absolute right-2 top-0 h-full bg-[#121212] text-white z-30 group rounded-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: width, transition: 'width 0.3s', height: '100%', top: 0 }}
    >
      {/* Collapse button, only visible on hover */}
      <button
        onClick={onClose}
        className={`absolute top-4 left-4 z-40 bg-black/70 p-2 rounded-full transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
        title="Collapse sidebar"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Resize handle */}
      <div 
        className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-white/20 transition-colors z-50"
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const startX = e.clientX
          const startWidth = width
          
          const handleMouseMove = (e: MouseEvent) => {
            const newWidth = Math.max(300, Math.min(500, startWidth - (e.clientX - startX)))
            setWidth(newWidth)
          }
          
          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
          }
          
          document.addEventListener('mousemove', handleMouseMove)
          document.addEventListener('mouseup', handleMouseUp)
        }}
      />
      <ScrollArea className="h-full">
        <div className="p-0">
          {/* Large background image with fade */}
          <div className="relative w-full" style={{ height: 340 }}>
            <div
              className="w-full h-full bg-cover bg-center rounded-t-xl"
              style={{
                backgroundImage: `url(${aboutData.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {/* About The Artist text */}
            <div className="absolute top-2 left-6">
              <h2 className="text-2xl font-bold text-white">About The Artist</h2>
            </div>
            {/* Fade overlay at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>

          {/* Name, avatar, tagline */}
          <div className="flex items-center px-6 -mt-12 mb-2 relative z-10">
            <img
              src={aboutData.avatar}
              alt="Profile"
              className="w-16 h-16 rounded-full border-4 border-black shadow-lg object-cover mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold leading-tight">{aboutData.name}</h1>
              <p className="text-sm text-gray-400 mt-1">{aboutData.tagline}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="px-6 mb-6">
            <p className="text-sm text-gray-300 leading-relaxed">{aboutData.bio}</p>
          </div>

          {/* Credits Section */}
          <div className="px-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Credits</h3>
              <button className="text-sm text-gray-400 hover:text-white" onClick={goToEducation}>Show all</button>
            </div>
            <div
              className="bg-[#1F1F1F] p-4 rounded-lg cursor-pointer hover:bg-[#2A2A2A] transition-colors"
              onClick={goToEducation}
            >
              <h4 className="font-medium text-white mb-1">{aboutData.education.institute}</h4>
              <p className="text-sm text-gray-400">{aboutData.education.title}</p>
              <button
                className="mt-2 px-4 py-1 border border-gray-600 rounded-full text-sm hover:bg-[#2A2A2A] transition-colors"
                onClick={goToEducation}
              >
                Follow
              </button>
            </div>
          </div>

          {/* On Tour Section */}
          <div className="px-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">On tour</h3>
              <button className="text-sm text-gray-400 hover:text-white" onClick={goToWorkExperience}>Show all</button>
            </div>
            <div className="space-y-4">
              {aboutData.workExperiences.map((experience, index) => (
                <div key={index} className="flex items-start space-x-4 cursor-pointer hover:bg-[#1F1F1F] p-2 rounded transition-colors" onClick={goToWorkExperience}>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Jan</div>
                    <div className="text-2xl font-bold">{experience.date.slice(-2)}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{experience.title}</h4>
                    <p className="text-sm text-gray-400">{experience.company}</p>
                    <p className="text-xs text-gray-500">{experience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 