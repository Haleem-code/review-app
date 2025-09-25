import { Company, Review, SearchResult } from './types';

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

const apiRequest = async (endpoint: string): Promise<any> => {
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

export const searchCompanies = async (query: string, page = 1): Promise<SearchResult> => {
  const data = await apiRequest(`/search?query=${encodeURIComponent(query)}&page=${page}`);
  return {
    companies: data.companies || [],
    total: data.total || 0,
    page: data.page || 1,
    hasMore: data.hasMore || false,
  };
};

export const getCompanyReviews = async (domain: string, page = 1): Promise<{ reviews: Review[]; hasMore: boolean }> => {
  const data = await apiRequest(`/companies/${domain}/reviews?page=${page}`);
  return {
    reviews: data.reviews || [],
    hasMore: data.hasMore || false,
  };
};

export const getCompanyDetails = async (domain: string): Promise<Company> => {
  return await apiRequest(`/companies/${domain}`);
};