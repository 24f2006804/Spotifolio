import jsPDF from "jspdf"

export const generateResume = () => {
  const doc = new jsPDF()

  // Set up colors
  const primaryColor = [30, 144, 255] // Blue
  const secondaryColor = [100, 100, 100] // Gray

  // Header Section
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 60, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text("AGNIJ DUTTA", 20, 25)

  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.text("Full Stack and Blockchain Developer", 20, 35)
  doc.text("Kolkata, West Bengal, India", 20, 45)

  // Reset text color
  doc.setTextColor(0, 0, 0)

  // Contact Information
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("📧 agnijdutta413@gmail.com", 20, 75)
  doc.text("💼 linkedin.com/in/agnij-dutta", 20, 82)
  doc.text("🐙 github.com/agnij-dutta", 20, 89)
  doc.text("🐦 @0xholmesdev", 20, 96)

  // Education Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("EDUCATION", 20, 115)
  doc.setTextColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.line(20, 118, 190, 118)

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Indian Institute of Technology, Madras", 20, 130)
  doc.setFont("helvetica", "normal")
  doc.text("BS Data Science and Applications", 20, 138)
  doc.text("Major: Data Science | Minor: Machine Learning", 20, 146)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text("Expected 2028", 150, 130)
  doc.setTextColor(0, 0, 0)

  // Experience Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("PROFESSIONAL EXPERIENCE", 20, 165)
  doc.setTextColor(0, 0, 0)
  doc.line(20, 168, 190, 168)

  // Workwise Experience
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("SDE Intern", 20, 180)
  doc.setFont("helvetica", "normal")
  doc.text("Workwise", 70, 180)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text("2025 - Present", 150, 180)
  doc.setTextColor(0, 0, 0)

  doc.setFontSize(10)
  doc.text("• Built impactful features boosting admin team productivity by 85%", 25, 190)
  doc.text("• Fixed bugs, added features, and improved UI to streamline revenue", 25, 197)
  doc.text("• Developed improvements that boosted sales and growth by 70%", 25, 204)

  // HackQuest Experience
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Developer Advocate", 20, 218)
  doc.setFont("helvetica", "normal")
  doc.text("HackQuest", 85, 218)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text("2024 - Present", 150, 218)
  doc.setTextColor(0, 0, 0)

  doc.setFontSize(10)
  doc.text("• Active participation in community growth events", 25, 228)
  doc.text("• Maintenance and regular bug fixes for platform stability", 25, 235)
  doc.text("• Focused on community growth and developer engagement", 25, 242)

  // Project Control & Systems Experience
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Data Science Intern", 20, 256)
  doc.setFont("helvetica", "normal")
  doc.text("Project Control & Systems", 90, 256)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text("2023 - 2024", 150, 256)
  doc.setTextColor(0, 0, 0)

  doc.setFontSize(10)
  doc.text("• Increased customer retention by 20% through data analysis", 25, 266)
  doc.text("• Boosted sales numbers by 30% with predictive modeling", 25, 273)
  doc.text("• Provided market analysis and strategies to increase reach", 25, 280)

  // Add second page
  doc.addPage()

  // Technical Skills Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("TECHNICAL SKILLS", 20, 30)
  doc.setTextColor(0, 0, 0)
  doc.line(20, 33, 190, 33)

  const skills = [
    { category: "Programming Languages", items: "JavaScript, TypeScript, Python, R, Java, Solidity, Rust, Move" },
    { category: "Frontend Development", items: "React, Next.js, HTML5, CSS3, Responsive Design" },
    { category: "Backend Development", items: "Node.js, Express.js, RESTful APIs, Microservices" },
    { category: "Machine Learning & AI", items: "TensorFlow, PyTorch, OpenCV, Scikit-learn, Data Analysis" },
    { category: "Blockchain Technologies", items: "Smart Contracts, DeFi, Web3.js, Ethers.js, NFTs" },
    { category: "Tools & Technologies", items: "Git, Docker, AWS, MongoDB, PostgreSQL, Redis" },
  ]

  let yPosition = 45
  skills.forEach((skill) => {
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(`${skill.category}:`, 20, yPosition)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const lines = doc.splitTextToSize(skill.items, 160)
    doc.text(lines, 20, yPosition + 8)
    yPosition += 20
  })

  // Key Projects Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("KEY PROJECTS", 20, yPosition + 10)
  doc.setTextColor(0, 0, 0)
  doc.line(20, yPosition + 13, 190, yPosition + 13)

  const projects = [
    {
      name: "E-Commerce Platform",
      tech: "Next.js, Node.js, Stripe Integration",
      description: "Full-stack e-commerce solution with payment processing and admin dashboard",
    },
    {
      name: "DeFi Trading Platform",
      tech: "Solidity, React, Web3.js",
      description: "Decentralized finance application with smart contract integration",
    },
    {
      name: "Computer Vision System",
      tech: "OpenCV, Python, TensorFlow",
      description: "Image processing and recognition system for automated analysis",
    },
    {
      name: "Admin Productivity Dashboard",
      tech: "React, Material-UI, Node.js",
      description: "Internal tool that improved team productivity by 85% at Workwise",
    },
  ]

  yPosition += 25
  projects.forEach((project) => {
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text(project.name, 20, yPosition)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFontSize(9)
    doc.text(project.tech, 20, yPosition + 7)
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    const descLines = doc.splitTextToSize(project.description, 160)
    doc.text(descLines, 20, yPosition + 14)
    yPosition += 25
  })

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text("Generated from Portfolio - github.com/agnij-dutta", 20, 280)

  // Save the PDF
  doc.save("Agnij_Dutta_Resume.pdf")
}
