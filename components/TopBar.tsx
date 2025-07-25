"use client"

import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Fuse from "fuse.js"
import { portfolioData as portfolioDataRaw } from "../components/MainContent"

// Helper to flatten portfolioData
function flattenPortfolioData(data: any) {
  const results: any[] = []
  Object.entries(data).forEach(([section, value]: any) => {
    value.items.forEach((item: any) => {
      results.push({
        ...item,
        section,
        sectionTitle: value.title,
        sectionDescription: value.description,
      })
    })
  })
  return results
}

const SEARCH_KEY = "recent_searches"

interface TopBarProps {
  onBack?: () => void
  onForward?: () => void
  canGoBack?: boolean
  canGoForward?: boolean
  setActiveSection?: (section: string) => void
}

export function TopBar({ onBack, onForward, canGoBack = true, canGoForward = true, setActiveSection }: TopBarProps) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_KEY)
    setRecent(stored ? JSON.parse(stored) : [])
  }, [])

  // Save recent searches
  const saveRecent = (val: string) => {
    let updated = [val, ...recent.filter((v) => v !== val)].slice(0, 5)
    setRecent(updated)
    localStorage.setItem(SEARCH_KEY, JSON.stringify(updated))
  }

  // Fuzzy search setup
  const portfolioData = flattenPortfolioData(portfolioDataRaw)
  const fuse = new Fuse(portfolioData, {
    keys: ["title", "type", "company", "section", "sectionTitle", "sectionDescription"],
    threshold: 0.4,
  })

  useEffect(() => {
    if (search.trim() === "") {
      setResults([])
      setHighlight(0)
      return
    }
    const res = fuse.search(search).map((r) => r.item).slice(0, 5)
    setResults(res)
    setHighlight(0)
  }, [search])

  // Handle outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === "ArrowDown") {
      setHighlight((h) => Math.min(h + 1, (search ? results.length : recent.length) - 1))
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      setHighlight((h) => Math.max(h - 1, 0))
      e.preventDefault()
    } else if (e.key === "Enter") {
      if (search && results[highlight]) {
        handleSelect(results[highlight])
      } else if (!search && recent[highlight]) {
        setSearch(recent[highlight])
      }
      setOpen(false)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  function handleSelect(item: any) {
    saveRecent(search)
    if (setActiveSection && item.section) {
      setActiveSection(item.section)
    }
    setOpen(false)
  }

  function handleInputFocus() {
    setOpen(true)
  }

  function handleClearRecent() {
    setRecent([])
    localStorage.removeItem(SEARCH_KEY)
  }

  return (
    <div className="bg-black px-6 py-3 flex items-center justify-between relative">
      {/* Navigation buttons - extreme left */}
      <div className="flex items-center gap-2">
        <button
          className={`w-8 h-8 'bg-gray-700 cursor-not-allowed'}`}
          onClick={canGoBack ? onBack : undefined}
          disabled={!canGoBack}
        >
          <ChevronLeft size={20} className={canGoBack ? "text-white" : "text-gray-400"} />
        </button>
        <button
          className={`w-8 h-8 'bg-gray-700 cursor-not-allowed'}`}
          onClick={canGoForward ? onForward : undefined}
          disabled={!canGoForward}
        >
          <ChevronRight size={20} className={canGoForward ? "text-white" : "text-gray-400"} />
        </button>
      </div>
      {/* Search bar - centered */}
      <div className="flex-1 flex justify-center max-w-md relative">
        <div className="relative w-full">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder="Search for Artists, Songs, or Playlists"
            className="w-full bg-[#1F1F1F] text-white placeholder-gray-400 pl-10 pr-16 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-white/20"
            autoComplete="off"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 select-none">Ctrl+K</span>
          {/* Dropdown/modal */}
          {open && (
            <div
              ref={dropdownRef}
              className="absolute left-0 mt-2 w-full bg-[#181818] rounded-xl shadow-lg z-50 border border-[#232323] overflow-hidden"
            >
              {search.trim() === "" ? (
                <>
                  <div className="px-4 pt-3 pb-2 text-sm font-bold text-white">Recent Searches</div>
                  <div className="border-b border-[#232323] mx-4 mb-2"></div>
                  {recent.length === 0 && <div className="px-4 py-2 text-gray-500">No recent searches</div>}
                  {recent.map((item, idx) => (
                    <div
                      key={item}
                      className={`px-4 py-2 cursor-pointer hover:bg-[#232323] ${highlight === idx ? "bg-[#232323]" : ""} text-white`}
                      onMouseDown={() => setSearch(item)}
                    >
                      {item}
                    </div>
                  ))}
                  {recent.length > 0 && (
                    <div className="px-4 py-2 text-right">
                      <button className="text-xs text-gray-400 hover:underline" onMouseDown={handleClearRecent}>
                        Clear recent searches
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {results.length === 0 && <div className="px-4 py-2 text-gray-500">No results found</div>}
                  {results.map((item, idx) => (
                    <div
                      key={item.title + item.company + item.section}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#232323] ${highlight === idx ? "bg-[#232323]" : ""}`}
                      onMouseDown={() => handleSelect(item)}
                    >
                      <img src={item.icon} alt="icon" className="w-6 h-6 rounded" />
                      <div>
                        <div className="font-medium text-white text-sm">{item.title}</div>
                        <div className="text-xs text-gray-400">{item.company} &middot; {item.sectionTitle}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Right side - empty for balance */}
      <div className="w-20"></div>
    </div>
  )
} 