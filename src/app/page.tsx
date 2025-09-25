'use client';
import { useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { CompanyCard } from '@/components/CompanyCard';
import { useSearchStore } from '@/stores/searchStore';
import { useFavoritesStore } from '@/stores/favoriteStore';

export default function HomePage() {
  const { companies, loading, error, hasMore, loadMore } = useSearchStore();
  const { initializeFavorites } = useFavoritesStore();

  useEffect(() => {
    initializeFavorites();
  }, [initializeFavorites]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Reviews App
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Search and discover company reviews from trusted sources
          </p>
          <SearchBar />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {companies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {companies.map(company => (
              <CompanyCard key={company.company_id} company={company} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-black/50 hover:bg-black/70 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg border border-white/20 transition-colors duration-200"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}