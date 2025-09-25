'use client';
import { useFavoritesStore } from '@/stores/favoriteStore';
import { Company } from '@/lib/types';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  company: Company;
}

export const FavoriteButton = ({ company }: FavoriteButtonProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(company.company_id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorited) {
      removeFavorite(company.company_id);
    } else {
      addFavorite(company);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors duration-200 ${
        favorited
          ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100'
          : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
      }`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
    </button>
  );
};