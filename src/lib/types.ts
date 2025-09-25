export interface Company {
  company_id: string;
  name: string;
  domain: string;
  review_count: number;
  trust_score: number;
  rating: number;
  categories: Array<{
    id: string;
    name: string;
  }>;
  website: string;
  phone?: string;
  email?: string;
  logo?: string;
  address?: string;
  city?: string;
  country?: string;
}

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
  review_url?: string;
}

export interface SearchApiResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    locale: string;
    min_rating: string;
    min_review_count: string;
    page: string;
  };
  data: {
    companies: Company[];
    total_companies: number;
  };
}

export interface SearchResult {
  companies: Company[];
  total: number;
  page: number;
  hasMore: boolean;
}