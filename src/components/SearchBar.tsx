"use client"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { useSearchStore } from "@/stores/searchStore"
import { Search, X } from "lucide-react"

export const SearchBar = () => {
  const [inputValue, setInputValue] = useState("")
  const debouncedQuery = useDebounce(inputValue, 300)
  const { search, loading, clearResults } = useSearchStore()

  useEffect(() => {
    search(debouncedQuery)
  }, [debouncedQuery, search])

  const handleClear = () => {
    setInputValue("")
    clearResults()
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
        <input
          type="text"
          placeholder="Search companies..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-12 pr-14 py-4 bg-black border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/40 outline-none text-lg text-white placeholder-white/50 transition-all duration-200"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute top-full left-0 right-0 mt-3 p-4 bg-black/95 border border-white/20 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="ml-3 text-white/80 font-medium">Searching...</span>
          </div>
        </div>
      )}
    </div>
  )
}
