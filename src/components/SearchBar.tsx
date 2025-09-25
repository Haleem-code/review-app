'use client';
import { useState,useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchStore } from '@/stores/searchStore';
import { Search, X } from 'lucide-react';

export const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebounce(inputValue, 300);
  const { search, loading, clearResults } = useSearchStore();

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const handleClear = () => {
    setInputValue('');
    clearResults();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search companies..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg text-black"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
};