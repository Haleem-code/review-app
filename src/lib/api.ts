import { Company, Review, SearchResult, SearchApiResponse } from './types';

const API_BASE_URL = 'https://trustpilot-company-and-reviews-data.p.rapidapi.com';
const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '';
const API_HOST = 'trustpilot-company-and-reviews-data.p.rapidapi.com';

export class ApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

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

const isSearchApiResponse = (data: unknown): data is SearchApiResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    'data' in data
  );
};

export const searchCompanies = async (query: string, page = 1): Promise<SearchResult> => {
  const response = await apiRequest(`/company-search?query=${encodeURIComponent(query)}`);
  
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
    hasMore: companies.length > 0 && totalCompanies > currentPage * 10,
  };
};

interface ReviewsApiResponse {
  data: {
    reviews: Review[];
    total_reviews?: number;
    rating_distribution?: unknown;
    review_language_distribution?: unknown;
  };
  parameters?: unknown;
  request_id?: string;
  status?: string;
}

const isReviewsApiResponse = (data: unknown): data is ReviewsApiResponse => {
  if (
    typeof data === 'object' &&
    data !== null &&
    'data' in data
  ) {
    const d = (data as { data: unknown }).data;
    if (
      typeof d === 'object' &&
      d !== null &&
      'reviews' in d &&
      Array.isArray((d as { reviews: unknown }).reviews)
    ) {
      return true;
    }
  }
  return false;
};

export const getCompanyReviews = async (domain: string, page = 1): Promise<{ reviews: Review[]; hasMore: boolean }> => {
  const response = await apiRequest(`/company-reviews?company_domain=${domain}`);
  console.log('API response from company-reviews:', response);
  if (!isReviewsApiResponse(response)) {
    throw new ApiError('Invalid response format from reviews API');
  }
  return {
    reviews: response.data.reviews || [],
    hasMore: (response.data.reviews?.length ?? 0) > 0,
  };
};

// Removed unused isCompany declaration

export const getCompanyDetails = async (domain: string): Promise<Company> => {
  const cleanDomain = domain.replace(/^www\./, '').toLowerCase();
  
  const searchQueries = [
    cleanDomain,
    cleanDomain.split('.')[0],
    domain,
    domain.split('.')[0]
  ];
  
  for (const query of searchQueries) {
    try {
      console.log(`Searching for: "${query}"`);
      const searchResult = await searchCompanies(query);
      console.log(`Found ${searchResult.companies.length} companies for query: "${query}"`);
      
      if (searchResult.companies.length > 0) {
        const company = searchResult.companies.find(c => {
          const companyDomain = c.domain.replace(/^www\./, '').toLowerCase();
          const companyWebsite = c.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase();
          
          return companyDomain === cleanDomain || 
                 companyWebsite === cleanDomain ||
                 companyDomain.includes(cleanDomain) ||
                 cleanDomain.includes(companyDomain) ||
                 c.name.toLowerCase().includes(query.toLowerCase());
        });
        
        if (company) {
          console.log('Found matching company:', company.name);
          return company;
        } else {
          console.log('No exact match, returning first result:', searchResult.companies[0].name);
          return searchResult.companies[0];
        }
      }
    } catch (error) {
      console.log(`Search failed for query "${query}":`, error);
      continue;
    }
  }
  
  throw new ApiError(`Company not found for domain: ${domain}. Try searching for the company name instead.`);
};