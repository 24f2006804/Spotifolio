"use client"

import { Play, Download } from "lucide-react"
import Image from "next/image"

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
        icon: "https://skillicons.dev/icons?i=python,r",
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
        icon: "https://skillicons.dev/icons?i=react,nodejs",
      },
      {
        title: "Developer Advocate",
        type: "Community growth and maintenance",
        company: "HackQuest",
        duration: "2024-present",
        icon: "https://skillicons.dev/icons?i=solidity,rust",
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
    items: [
      {
        title: "Computer Vision System",
        type: "OpenCV, Python",
        company: "Personal Project",
        duration: "2024",
        icon: "https://skillicons.dev/icons?i=python",
      },
      {
        title: "Predictive Analytics Tool",
        type: "TensorFlow, Python",
        company: "Academic Project",
        duration: "2023",
        icon: "https://skillicons.dev/icons?i=python",
      },
      {
        title: "Data Visualization Dashboard",
        type: "R, D3.js",
        company: "Course Project",
        duration: "2023",
        icon: "https://skillicons.dev/icons?i=r",
      },
      {
        title: "Natural Language Processor",
        type: "PyTorch, NLTK",
        company: "Research Project",
        duration: "2022",
        icon: "https://skillicons.dev/icons?i=python",
      },
      {
        title: "Machine Learning Model",
        type: "Scikit-learn, Python",
        company: "Hackathon Project",
        duration: "2022",
        icon: "https://skillicons.dev/icons?i=python",
      },
    ],
  },
  "Web Projects": {
    title: "Web Projects",
    subtitle: "Full-Stack Applications",
    description: "React • Next.js • Node.js • TypeScript",
    gradient: "from-orange-900 to-black",
    items: [
      {
        title: "E-Commerce Platform",
        type: "Next.js, Node.js",
        company: "Client Project",
        duration: "2024",
        icon: "https://skillicons.dev/icons?i=nextjs,nodejs",
      },
      {
        title: "Portfolio Website",
        type: "React, TypeScript",
        company: "Personal Project",
        duration: "2024",
        icon: "https://skillicons.dev/icons?i=react,typescript",
      },
      {
        title: "Admin Dashboard",
        type: "React, Material UI",
        company: "Workwise",
        duration: "2023",
        icon: "https://skillicons.dev/icons?i=react",
      },
      {
        title: "Social Media App",
        type: "MERN Stack",
        company: "Team Project",
        duration: "2023",
        icon: "https://skillicons.dev/icons?i=react,nodejs",
      },
      {
        title: "API Development",
        type: "Node.js, Express",
        company: "Backend Service",
        duration: "2022",
        icon: "https://skillicons.dev/icons?i=nodejs",
      },
    ],
  },
  "Blockchain Projects": {
    title: "Blockchain Projects",
    subtitle: "Web3 & Cryptocurrency",
    description: "Solidity • Rust • Move • Smart Contracts",
    gradient: "from-yellow-900 to-black",
    items: [
      {
        title: "DeFi Application",
        type: "Solidity, React",
        company: "Personal Project",
        duration: "2024",
        icon: "https://skillicons.dev/icons?i=solidity,react",
      },
      {
        title: "NFT Marketplace",
        type: "Solidity, Next.js",
        company: "Hackathon Project",
        duration: "2023",
        icon: "https://skillicons.dev/icons?i=solidity,nextjs",
      },
      {
        title: "Smart Contract System",
        type: "Solidity, Hardhat",
        company: "Client Project",
        duration: "2023",
        icon: "https://skillicons.dev/icons?i=solidity",
      },
      {
        title: "Blockchain Explorer",
        type: "React, Web3.js",
        company: "Open Source",
        duration: "2022",
        icon: "https://skillicons.dev/icons?i=react",
      },
      {
        title: "Cryptocurrency Wallet",
        type: "React Native, Ethers.js",
        company: "Mobile App",
        duration: "2022",
        icon: "https://skillicons.dev/icons?i=react",
      },
    ],
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
  "Open Source": {
    title: "Open Source",
    subtitle: "Community Contributions",
    description: "GitHub contributions • Open source projects • Community involvement",
    gradient: "from-pink-900 to-black",
    items: [
      {
        title: "React Component Library",
        type: "UI Components",
        company: "GitHub",
        duration: "2024",
        icon: "https://skillicons.dev/icons?i=react,typescript",
      },
      {
        title: "Blockchain Development Tools",
        type: "Developer Utilities",
        company: "GitHub",
        duration: "2023",
        icon: "https://skillicons.dev/icons?i=solidity,rust",
      },
      {
        title: "Data Visualization Package",
        type: "Python Library",
        company: "PyPI",
        duration: "2023",
        icon: "https://skillicons.dev/icons?i=python",
      },
      {
        title: "Smart Contract Templates",
        type: "Solidity",
        company: "GitHub",
        duration: "2022",
        icon: "https://skillicons.dev/icons?i=solidity",
      },
      {
        title: "Machine Learning Utilities",
        type: "Python Package",
        company: "GitHub",
        duration: "2022",
        icon: "https://skillicons.dev/icons?i=python",
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
      },
      {
        title: "LinkedIn",
        type: "linkedin.com/in/agnij-dutta",
        company: "Professional Network",
        duration: "Active",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
      },
      {
        title: "GitHub",
        type: "github.com/agnij-dutta",
        company: "Code Portfolio",
        duration: "Active",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg",
      },
      {
        title: "X",
        type: "@0xholmesdev",
        company: "Tech Discussions",
        duration: "Active",
        icon: "https://img.icons8.com/fluency/48/ffffff/twitter.png",
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
  "Open Source": [
    { label: "Project", field: "title", icon: true },
    { label: "Type", field: "type" },
    { label: "Platform", field: "company" },
    { label: "Year", field: "duration" },
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
}

export function MainContent({ activeSection }: MainContentProps) {
  const currentData = portfolioData[activeSection as keyof typeof portfolioData] || portfolioData["Education"]
  const columns = sectionColumns[activeSection] || sectionColumns["Education"]

  return (
    <div className="flex-1 bg-[#121212] text-white overflow-y-auto rounded-xl h-full">
      <div className={`bg-gradient-to-b ${currentData.gradient} rounded-t-xl p-4 md:p-8 relative`}>
        {/* Fade gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none"></div>
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold">PORTFOLIO</p>
          <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-4">{currentData.title}</h1>
          <p className="text-base text-gray-300">{currentData.description}</p>
        </div>

      {/* Play Button */}
      <div className="mb-8">
        <button className="bg-green-500 text-black font-semibold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-green-400 flex items-center">
              <Play fill="currentColor" size={20} className="inline mr-2" />
              Play
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
            {currentData.items.map((item, index) => (
              <tr key={index} className="hover:bg-white/10">
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
                          <span className="text-white text-lg font-medium">{(item as any)[col.field]}</span>
                    </div>
                      ) : (
                        <span className="text-lg">{(item as any)[col.field]}</span>
                      )}
                </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="md:hidden space-y-4">
        {currentData.items.map((item, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg hover:bg-white/10">
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
                </div>
              </div>
              {columns.slice(1).map((col) => (
                <div key={col.field} className="ml-8 pl-3 text-base text-gray-300">
                  <span className="font-semibold">{col.label}: </span>{(item as any)[col.field]}
            </div>
              ))}
            </div>
          ))}
          </div>
      </div>
    </div>
  )
}
