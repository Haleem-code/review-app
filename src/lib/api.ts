import { Company, Review, SearchResult, SearchApiResponse } from './types';

const API_BASE_URL = 'https://trustpilot-company-and-reviews-data.p.rapidapi.com';
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '9a735d8d00msh0d16f1bba590cb9p14fec4jsn538730a23266';
const API_HOST = 'trustpilot-company-and-reviews-data.p.rapidapi.com';

export class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

// Generic API request function that returns unknown data
const apiRequest = async (endpoint: string): Promise<unknown> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error occurred');
  }
};

// Type guard to check if response matches SearchApiResponse structure
const isSearchApiResponse = (data: unknown): data is SearchApiResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    'status' in data
  );
};

export const searchCompanies = async (query: string, page = 1): Promise<SearchResult> => {
  const response = await apiRequest(`/search?query=${encodeURIComponent(query)}&page=${page}`);
  
  // Type guard to ensure we have the correct response structure
  if (!isSearchApiResponse(response)) {
    throw new ApiError('Invalid response format from search API');
  }
  
  const companies = response.data?.companies || [];
  const totalCompanies = response.data?.total_companies || 0;
  const currentPage = parseInt(response.parameters?.page || '1');
  
  return {
    companies,
    total: totalCompanies,
    page: currentPage,
    // Assuming 10 items per page, check if there are more pages
    hasMore: companies.length > 0 && totalCompanies > currentPage * 10,
  };
};

// Type for company reviews response (you may need to adjust this based on actual API response)
interface ReviewsApiResponse {
  reviews: Review[];
  hasMore?: boolean;
  total?: number;
  page?: number;
}

// Type guard for reviews response
const isReviewsApiResponse = (data: unknown): data is ReviewsApiResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'reviews' in data &&
    Array.isArray((data as ReviewsApiResponse).reviews)
  );
};

export const getCompanyReviews = async (domain: string, page = 1): Promise<{ reviews: Review[]; hasMore: boolean }> => {
  const response = await apiRequest(`/companies/${domain}/reviews?page=${page}`);
  
  if (!isReviewsApiResponse(response)) {
    throw new ApiError('Invalid response format from reviews API');
  }
  
  return {
    reviews: response.reviews || [],
    hasMore: response.hasMore || false,
  };
};

// Type guard for company details response
const isCompany = (data: unknown): data is Company => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'company_id' in data &&
    'name' in data &&
    'domain' in data
  );
};

export const getCompanyDetails = async (domain: string): Promise<Company> => {
  const response = await apiRequest(`/companies/${domain}`);
  
  if (!isCompany(response)) {
    throw new ApiError('Invalid response format from company details API');
  }
  
  return response;
};