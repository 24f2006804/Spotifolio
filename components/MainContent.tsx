"use client"

import { Play, Download, Shuffle } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { generateResume } from "../utils/resumeGenerator"
import { useEffect, useState } from "react"
import { fetchGitHubProjects, CategorizedProject } from "@/lib/github"
import { Loading, LoadingRow, LoadingCard } from "@/components/ui/loading"

const portfolioData = {
  Education: {
    title: "Education",
    subtitle: "Academic Background",
    description: "Data Science • Machine Learning • Computer Science",
    gradient: "from-blue-900 to-black",
    items: [
      {
        title: "BS Data Science and Applications",
        type: "Major: Data Science | Minor: Machine Learning",
        company: "Indian Institute of Technology, Madras",
        duration: "2028",
        icon: "/iit-madras-logo.svg",
      },
    ],
  },
  "Work Experience": {
    title: "Work Experience",
    subtitle: "Professional Journey",
    description: "Internships • Developer Roles • Data Science",
    gradient: "from-green-900 to-black",
    items: [
      {
        title: "SDE Intern",
        type: "Built features to boost admin productivity by 85%",
        company: "Workwise",
        duration: "2025-present",
        icon: "/workwise.png",
      },
      {
        title: "Developer Advocate",
        type: "Community growth and maintenance",
        company: "HackQuest",
        duration: "2024-present",
        icon: "/hackquest.webp",
      },
      {
        title: "Data Science Intern",
        type: "Increased customer retention by 20%",
        company: "Project Control & Systems",
        duration: "2023-2024",
        icon: "https://skillicons.dev/icons?i=python,r",
      },
    ],
  },
  "AI Projects": {
    title: "AI Projects",
    subtitle: "Machine Learning & Data Science",
    description: "TensorFlow • PyTorch • OpenCV • Data Analysis",
    gradient: "from-purple-900 to-black",
    items: [],
  },
  "Web Projects": {
    title: "Web Projects",
    subtitle: "Full-Stack Applications",
    description: "React • Next.js • Node.js • TypeScript",
    gradient: "from-orange-900 to-black",
    items: [],
  },
  "Blockchain Projects": {
    title: "Blockchain Projects",
    subtitle: "Web3 & Cryptocurrency",
    description: "Solidity • Rust • Move • Smart Contracts",
    gradient: "from-yellow-900 to-black",
    items: [],
  },
  "Skills & Tools": {
    title: "Skills & Tools",
    subtitle: "Technical Expertise",
    description: "Programming languages • Frameworks • Development tools",
    gradient: "from-red-900 to-black",
    items: [
      {
        title: "JavaScript/TypeScript",
        type: "Programming Language",
        company: "Frontend & Backend",
        duration: "Expert",
        icon: "https://skillicons.dev/icons?i=js,typescript",
      },
      {
        title: "React/Next.js",
        type: "Frontend Framework",
        company: "UI Development",
        duration: "Expert",
        icon: "https://skillicons.dev/icons?i=react,nextjs",
      },
      {
        title: "Node.js",
        type: "Backend Framework",
        company: "API Development",
        duration: "Advanced",
        icon: "https://skillicons.dev/icons?i=nodejs",
      },
      {
        title: "Python/R",
        type: "Data Science",
        company: "ML & Analysis",
        duration: "Advanced",
        icon: "https://skillicons.dev/icons?i=python,r",
      },
      {
        title: "Solidity/Rust",
        type: "Blockchain",
        company: "Smart Contracts",
        duration: "Advanced",
        icon: "https://skillicons.dev/icons?i=solidity,rust",
      },
      {
        title: "HTML/CSS",
        type: "Web Development",
        company: "Frontend",
        duration: "Expert",
        icon: "https://skillicons.dev/icons?i=html,css",
      },
      {
        title: "Java",
        type: "Programming Language",
        company: "Backend",
        duration: "Intermediate",
        icon: "https://skillicons.dev/icons?i=java",
      },
      {
        title: "Database & Cloud",
        type: "Supabase, Firebase",
        company: "Backend Services",
        duration: "Advanced",
        icon: "https://skillicons.dev/icons?i=supabase,firebase",
      },
    ],
  },

  Contact: {
    title: "Contact Me",
    subtitle: "Get In Touch",
    description: "Available for opportunities • Remote work • Collaboration",
    gradient: "from-teal-900 to-black",
    items: [
      {
        title: "Email",
        type: "agnijdutta413@gmail.com",
        company: "Primary Contact",
        duration: "24/7",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
        url: "mailto:agnijdutta413@gmail.com",
      },
      {
        title: "LinkedIn",
        type: "linkedin.com/in/agnij-dutta",
        company: "Professional Network",
        duration: "Active",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
        url: "https://linkedin.com/in/agnij-dutta",
      },
      {
        title: "GitHub",
        type: "github.com/agnij-dutta",
        company: "Code Portfolio",
        duration: "Active",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg",
        url: "https://github.com/agnij-dutta",
      },
      {
        title: "X",
        type: "@0xholmesdev",
        company: "Tech Discussions",
        duration: "Active",
        icon: "https://img.icons8.com/fluency/48/ffffff/twitter.png",
        url: "https://x.com/0xholmesdev",
      },
      {
        title: "Location",
        type: "Kolkata, West Bengal",
        company: "India",
        duration: "Local Time",
        icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgeD0iNSIgeT0iMzAiIGZvbnQtc2l6ZT0iMjQiPvCfk408L3RleHQ+Cjwvc3ZnPgo=",
      },
    ],
  },
}

export { portfolioData }

const sectionColumns: Record<string, { label: string; field: string; icon?: boolean }[]> = {
  "Education": [
    { label: "Degree", field: "title", icon: true },
    { label: "Institute", field: "company" },
    { label: "Year", field: "duration" },
  ],
  "Work Experience": [
    { label: "Role", field: "title", icon: true },
    { label: "Company", field: "company" },
    { label: "Duration", field: "duration" },
    { label: "Description", field: "type" },
  ],
  "AI Projects": [
    { label: "Project", field: "title", icon: true },
    { label: "Tech Stack", field: "type" },
    { label: "Type", field: "company" },
    { label: "Year", field: "duration" },
  ],
  "Web Projects": [
    { label: "Project", field: "title", icon: true },
    { label: "Tech Stack", field: "type" },
    { label: "Type", field: "company" },
    { label: "Year", field: "duration" },
  ],
  "Blockchain Projects": [
    { label: "Project", field: "title", icon: true },
    { label: "Tech Stack", field: "type" },
    { label: "Type", field: "company" },
    { label: "Year", field: "duration" },
  ],
  "Skills & Tools": [
    { label: "Skill", field: "title", icon: true },
    { label: "Type", field: "type" },
    { label: "Area", field: "company" },
    { label: "Level", field: "duration" },
  ],

  "Contact": [
    { label: "Method", field: "title", icon: true },
    { label: "Value", field: "type" },
    { label: "Status", field: "company" },
    { label: "Availability", field: "duration" },
  ],
}

interface MainContentProps {
  activeSection: string
  setActiveSection: (section: string) => void
  onOpenRightSidebar: () => void
}

export function MainContent({ activeSection, setActiveSection, onOpenRightSidebar }: MainContentProps) {
  const [githubProjects, setGitHubProjects] = useState<{
    'AI Projects': CategorizedProject[]
    'Web Projects': CategorizedProject[]
    'Blockchain Projects': CategorizedProject[]
  }>({
    'AI Projects': [],
    'Web Projects': [],
    'Blockchain Projects': []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  // Fetch GitHub projects on component mount and when switching to project tabs
  useEffect(() => {
    const loadGitHubProjects = async () => {
      // Only fetch if switching to a project tab or if not loaded yet
      const isProjectTab = activeSection === 'AI Projects' || activeSection === 'Web Projects' || activeSection === 'Blockchain Projects'
      
      if (!isProjectTab && hasLoaded) return
      
      setIsLoading(true)
      try {
        const projects = await fetchGitHubProjects()
        setGitHubProjects(projects)
        setHasLoaded(true)
      } catch (error) {
        console.error('Failed to load GitHub projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGitHubProjects()
  }, [activeSection, hasLoaded])

  // Merge GitHub data with hardcoded data
  const getCurrentData = () => {
    const baseData = portfolioData[activeSection as keyof typeof portfolioData] || portfolioData["Education"]
    
    // For project sections, merge with GitHub data
    if (activeSection === 'AI Projects' || activeSection === 'Web Projects' || activeSection === 'Blockchain Projects') {
      const githubData = githubProjects[activeSection as keyof typeof githubProjects] || []
      
      if (githubData.length > 0) {
        return {
          ...baseData,
          items: githubData
        }
      }
    }
    
    return baseData
  }

  const currentData = getCurrentData()
  const columns = sectionColumns[activeSection] || sectionColumns["Education"]
  const sectionNames = Object.keys(portfolioData)

  // Handler for shuffle
  const handleShuffle = () => {
    let randomSection = activeSection
    while (randomSection === activeSection) {
      randomSection = sectionNames[Math.floor(Math.random() * sectionNames.length)]
    }
    setActiveSection(randomSection)
  }

  return (
    <ScrollArea className="flex-1 bg-[#121212] text-white rounded-xl h-full">
      <div className={`bg-gradient-to-b ${currentData.gradient} rounded-t-xl p-4 md:p-8 relative`}>
        {/* Fade gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none"></div>
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold">PORTFOLIO</p>
          <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-4">{currentData.title}</h1>
          <p className="text-base text-gray-300">{currentData.description}</p>
        </div>

        {/* Spotify-style controls */}
        <div className="mb-8 flex items-center gap-4">
          {/* Play Button */}
          <a
            href="https://drive.google.com/uc?export=download&id=1ATfZjD1YXQlBkNpUVVPtonMGkCvjYo-A"
            download
            className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-400 transition-colors shadow-lg focus:outline-none"
            title="Play Resume"
          >
            <Play size={36} className="text-black" />
          </a>
          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#232323] hover:bg-[#333] transition-colors text-white"
            title="Shuffle Section"
          >
            <Shuffle size={28} />
          </button>
          {/* Download Button */}
          <button
            onClick={generateResume}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#232323] hover:bg-[#333] transition-colors text-white"
            title="Download Resume (PDF)"
          >
            <Download size={28} />
          </button>
        </div>
      </div>
      {/* Table content in bottom section */}
      <div className="p-4 md:p-8">
      {/* Responsive table for larger screens */}
      <div className="hidden md:block">
          <table className="w-full text-left text-base text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
                <th className="pb-3 text-lg font-semibold">#</th>
                {columns.map((col) => (
                  <th key={col.field} className="pb-3 text-lg font-semibold">{col.label}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (activeSection === 'AI Projects' || activeSection === 'Web Projects' || activeSection === 'Blockchain Projects') ? (
              // Show loading rows for project sections
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingRow key={index} />
              ))
            ) : currentData.items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-gray-400">
                  <Loading message="No projects found" />
                </td>
              </tr>
            ) : (
              currentData.items.map((item, index) => (
                <tr key={index} className={`hover:bg-white/10 cursor-pointer ${('url' in item && item.url) ? 'hover:bg-blue-500/20' : ''}`} onClick={() => {
                  // If it's a GitHub project, open the URL instead of sidebar
                  if ('url' in item && typeof item.url === 'string' && item.url) {
                    window.open(item.url, '_blank')
                  } else {
                    onOpenRightSidebar()
                  }
                }}>
                  <td className="py-3">{index + 1}</td>
                  {columns.map((col, colIdx) => (
                    <td className="py-3" key={col.field}>
                      {col.icon ? (
                        <div className="flex items-center">
                          <Image
                            src={item.icon || "/placeholder.svg?height=40&width=40"}
                            width={40}
                            height={40}
                            alt={`${item.title} icon`}
                            className={`mr-3 rounded ${item.title === "GitHub" ? "filter invert" : ""}`}
                          />
                          <div>
                            <span className="text-white text-lg font-medium">{(item as any)[col.field]}</span>
                            {'stars' in item && typeof item.stars === 'number' && item.stars > 0 && (
                              <div className="text-xs text-gray-400 mt-1">
                                ⭐ {item.stars} • 🍴 {(item as CategorizedProject).forks}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-lg">{(item as any)[col.field]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="md:hidden space-y-4">
        {isLoading && (activeSection === 'AI Projects' || activeSection === 'Web Projects' || activeSection === 'Blockchain Projects') ? (
          // Show loading cards for project sections
          Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={index} />
          ))
        ) : currentData.items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Loading message="No projects found" />
          </div>
        ) : (
          currentData.items.map((item, index) => (
            <div key={index} className={`bg-white/5 p-4 rounded-lg hover:bg-white/10 cursor-pointer ${('url' in item && item.url) ? 'hover:bg-blue-500/20' : ''}`} onClick={() => {
              // If it's a GitHub project, open the URL instead of sidebar
              if ('url' in item && typeof item.url === 'string' && item.url) {
                window.open(item.url, '_blank')
              } else {
                onOpenRightSidebar()
              }
            }}>
              <div className="flex items-center mb-2">
                <span className="text-base text-gray-400 mr-2">{index + 1}</span>
                {columns[0].icon && (
                  <Image
                    src={item.icon || "/placeholder.svg?height=40&width=40"}
                    width={40}
                    height={40}
                    alt={`${item.title} icon`}
                    className={`mr-3 rounded ${item.title === "GitHub" ? "filter invert" : ""}`}
                  />
                )}
                <div>
                  <p className="text-white font-medium text-lg">{(item as any)[columns[0].field]}</p>
                  {'stars' in item && typeof item.stars === 'number' && item.stars > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      ⭐ {item.stars} • 🍴 {(item as CategorizedProject).forks}
                    </div>
                  )}
                </div>
              </div>
              {columns.slice(1).map((col) => (
                <div key={col.field} className="ml-8 pl-3 text-base text-gray-300">
                  <span className="font-semibold">{col.label}: </span>{(item as any)[col.field]}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      </div>
    </ScrollArea>
  )
}
