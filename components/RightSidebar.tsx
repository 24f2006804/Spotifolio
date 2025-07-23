"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea as ModalScrollArea } from "@/components/ui/scroll-area"
import { Users, Headphones, MapPin } from "lucide-react"

interface RightSidebarProps {
  isOpen: boolean
  onClose: () => void
  setActiveSection?: (section: string) => void
  width: number
  setWidth: (width: number) => void
}

export function RightSidebar({ isOpen, onClose, setActiveSection, width, setWidth }: RightSidebarProps) {
  const [hovered, setHovered] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  if (!isOpen) return null

  const aboutData = {
    name: "Agnij Dutta",
    tagline: "Building meaningful things with code.",
    backgroundImage: "https://github.com/agnij-dutta/agnij-dutta/blob/main/background-mic.jpeg?raw=true",
    avatar: "https://avatars.githubusercontent.com/u/126397667?v=4",
    shortBio: "In the realm of technologies and innovation, where code weaves enchanting solutions, there exists a young developer named Agnij Dutta...",
    fullBio: `Agnij Dutta is a passionate full stack and blockchain developer with a love for building meaningful products. With a background in Data Science from IIT Madras, Agnij has worked on a wide range of projects from AI to Web3, always focusing on human-centered design and impactful solutions. He believes in continuous learning, open source, and the power of technology to connect people.\n\nAgnij's journey includes major contributions to open source, leadership in hackathons, and a drive to make technology accessible and ethical. When not coding, he enjoys music, reading, and exploring new ideas.`,
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

          {/* Name, avatar, tagline, short bio - clickable area */}
          <div
            className="flex flex-col gap-2 px-6 -mt-12 mb-2 relative z-10 cursor-pointer hover:bg-[#232323] rounded-xl transition-colors"
            onClick={() => setAboutOpen(true)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center">
              <img
                src={aboutData.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-black shadow-lg object-cover mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold leading-tight underline hover:text-green-400 transition-colors">{aboutData.name}</h1>
                <p className="text-sm text-gray-400 mt-1">{aboutData.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-2">
              {aboutData.shortBio} <button className="text-green-400 underline ml-1" onClick={e => { e.stopPropagation(); setAboutOpen(true); }}>View more</button>
            </p>
          </div>

          {/* Modal for About section */}
          <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
            <DialogOverlay className="bg-black/40" />
            <DialogContent className="bg-[#181818] rounded-2xl max-w-3xl w-full p-0 text-white flex flex-row items-stretch shadow-2xl border-none overflow-hidden">
              <DialogTitle className="sr-only">{aboutData.name}</DialogTitle>
              {/* Left column: avatar, name, tagline, stats */}
              <div className="flex flex-col items-center justify-center w-80 min-w-[320px] bg-[#232323] p-8 border-r border-[#222]">
                <img
                  src={aboutData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-black shadow-lg object-cover mb-4"
                />
                <h1 className="text-2xl font-bold mb-1 text-center">{aboutData.name}</h1>
                <p className="text-base text-gray-400 mb-6 text-center">{aboutData.tagline}</p>
                {/* Fake stats */}
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <Users className="text-green-400" size={22} />
                    <div>
                      <div className="text-lg font-semibold">10,621,373</div>
                      <div className="text-xs text-gray-400">Followers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Headphones className="text-green-400" size={22} />
                    <div>
                      <div className="text-lg font-semibold">2,579,078</div>
                      <div className="text-xs text-gray-400">Monthly Listeners</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-green-400" size={22} />
                    <div>
                      <div className="text-lg font-semibold">Kolkata, IN</div>
                      <div className="text-xs text-gray-400">Location</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right column: about, scrollable */}
              <div className="flex-1 p-8 flex flex-col">
                <ModalScrollArea className="h-full max-h-[1200px] pr-2">
                  <div className="text-base text-gray-300 whitespace-pre-line text-left leading-relaxed">
                    {aboutData.fullBio}
                  </div>
                </ModalScrollArea>
              </div>
            </DialogContent>
          </Dialog>

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