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

// Define response types for better type safety
interface ApiResponse {
  [key: string]: unknown;
}

const apiRequest = async (endpoint: string): Promise<ApiResponse> => {
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

    return await response.json() as ApiResponse;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error occurred');
  }
};

export const searchCompanies = async (query: string, page = 1): Promise<SearchResult> => {
  const data = await apiRequest(`/search?query=${encodeURIComponent(query)}&page=${page}`) as SearchApiResponse;
  
  return {
    companies: data.data?.companies || [],
    total: data.data?.total_companies || 0,
    page: parseInt(data.parameters?.page || '1'),
    hasMore: (data.data?.companies || []).length > 0 && (data.data?.total_companies || 0) > page * 10,
  };
};

export const getCompanyReviews = async (domain: string, page = 1): Promise<{ reviews: Review[]; hasMore: boolean }> => {
  const data = await apiRequest(`/companies/${domain}/reviews?page=${page}`);
  return {
    reviews: (data.reviews as Review[]) || [],
    hasMore: (data.hasMore as boolean) || false,
  };
};

export const getCompanyDetails = async (domain: string): Promise<Company> => {
  return await apiRequest(`/companies/${domain}`) as Company;
};