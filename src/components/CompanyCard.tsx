'use client';
import Link from 'next/link';
import { Company } from '@/lib/types';
import { FavoriteButton } from './FavoriteButton';
import { Star, Users } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {company.logo && (
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.domain}</p>
          </div>
        </div>
        <FavoriteButton company={company} />
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            {renderStars(company.rating)}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {company.rating.toFixed(1)}
          </span>
        </div>
        
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{company.review_count.toLocaleString()} reviews</span>
        </div>
      </div>

      {company.categories && company.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {company.categories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/company/${company.domain}`}
        className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        View Reviews
      </Link>
    </div>
  );
};