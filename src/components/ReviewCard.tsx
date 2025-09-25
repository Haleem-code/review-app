import { Star, User } from 'lucide-react';

export interface Review {
  id?: string;
  review_text: string;
  rating: number;
  reviewer_name: string;
  review_date: string;
  title?: string;
  verified?: boolean;
  helpful_count?: number;
  reviewer_country?: string;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 bg-green-50';
    if (rating >= 3) return 'text-yellow-600 bg-yellow-50';
    if (rating >= 2) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-white">
     
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(review.rating)}`}>
            {review.rating}/5
          </span>
        </div>
        <span className="text-sm text-white/50">
          {formatDate(review.review_date)}
        </span>
      </div>

      
      {review.title && (
        <h3 className="font-semibold text-white mb-2 line-clamp-2">
          {review.title}
        </h3>
      )}


      <p className="text-white/70 mb-4 line-clamp-4 leading-relaxed">
        {review.review_text}
      </p>

    
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white/70">
              {review.reviewer_name || 'Anonymous'}
            </span>
            {review.reviewer_country && (
              <span className="text-xs text-gray-500">
                {review.reviewer_country}
              </span>
            )}
          </div>
          {review.verified && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              Verified
            </span>
          )}
        </div>

        {review.helpful_count !== undefined && review.helpful_count > 0 && (
          <span className="text-xs text-gray-500">
            {review.helpful_count} found helpful
          </span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;