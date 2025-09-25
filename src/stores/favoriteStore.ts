'use client';
import { create } from 'zustand';
import { Company } from '@/lib/types';

interface FavoritesState {
  favorites: Company[];
  addFavorite: (company: Company) => void;
  removeFavorite: (companyId: string) => void;
  isFavorite: (companyId: string) => boolean;
  initializeFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],

  addFavorite: (company: Company) => {
    set(state => {
      const newFavorites = [...state.favorites, company];
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      return { favorites: newFavorites };
    });
  },

  removeFavorite: (companyId: string) => {
    set(state => {
      const newFavorites = state.favorites.filter(fav => fav.id !== companyId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      return { favorites: newFavorites };
    });
  },

  isFavorite: (companyId: string) => {
    return get().favorites.some(fav => fav.id === companyId);
  },

  initializeFavorites: () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('favorites');
        if (stored) {
          set({ favorites: JSON.parse(stored) });
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  },
}));