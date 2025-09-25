'use client';
import { create } from 'zustand';
import { Company, SearchResult } from '@/lib/types';
import { searchCompanies } from '@/lib/api';

interface SearchState {
  query: string;
  companies: Company[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  companies: [],
  loading: false,
  error: null,
  hasMore: false,
  page: 1,

  setQuery: (query: string) => set({ query }),

  search: async (query: string) => {
    if (!query.trim()) {
      set({ companies: [], error: null, hasMore: false });
      return;
    }

    set({ loading: true, error: null, page: 1 });

    try {
      const result = await searchCompanies(query, 1);
      set({
        companies: result.companies,
        hasMore: result.hasMore,
        loading: false,
        page: 1,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Search failed',
        loading: false,
        companies: [],
      });
    }
  },

  loadMore: async () => {
    const { query, page, hasMore, loading } = get();
    
    if (!hasMore || loading || !query) return;

    set({ loading: true });

    try {
      const result = await searchCompanies(query, page + 1);
      set(state => ({
        companies: [...state.companies, ...result.companies],
        hasMore: result.hasMore,
        page: state.page + 1,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load more',
        loading: false,
      });
    }
  },

  clearResults: () => set({ companies: [], error: null, hasMore: false, page: 1 }),
}));