"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getCompanyDetails, getCompanyReviews } from "@/lib/api"
import type { Company, Review } from "@/lib/types"
import ReviewCard from "@/components/ReviewCard"

export default function CompanyPage() {
  const { domain } = useParams()
  const [company, setCompany] = useState<Company | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!domain) return

    const loadCompanyData = async () => {
      setLoading(true)
      setError(null)

      try {
        let companyData: Company

        const cachedCompany = sessionStorage.getItem(`company-${domain}`)
        if (cachedCompany) {
          console.log("Using cached company data")
          companyData = JSON.parse(cachedCompany)
        } else {
          console.log("Looking for company with domain:", domain)
          companyData = await getCompanyDetails(decodeURIComponent(domain as string))
        }

        setCompany(companyData)
        console.log("Found company:", companyData)

        setReviewsLoading(true)
        try {
          const reviewsData = await getCompanyReviews(companyData.domain)
          setReviews(reviewsData.reviews)
        } catch (reviewError) {
          console.error("Failed to load reviews:", reviewError)
        } finally {
          setReviewsLoading(false)
        }
      } catch (err) {
        console.error("Company lookup error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch company details.")
        setCompany(null)
      } finally {
        setLoading(false)
      }
    }

    loadCompanyData()
  }, [domain])

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>
  if (!company) return <div className="p-8 text-center text-white">No company found.</div>

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black rounded-2xl shadow-2xl p-10 mb-8 border border-white/10">
          <div className="flex items-center space-x-6 mb-8">
            {company.logo && (
              <img
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/20"
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{company.name}</h2>
              <p className="text-white/70 text-lg font-medium">{company.domain}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-white">Rating:</span>
              <span className="text-white/90 text-lg">{company.rating?.toFixed(1)} / 5</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-white">Reviews:</span>
              <span className="text-white/90 text-lg">{company.review_count?.toLocaleString()}</span>
            </div>
          </div>
          {company.categories && company.categories.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {company.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-4 py-2 bg-white/10 text-white/80 text-sm font-medium rounded-full border border-white/10"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
          {company.website && (
            <div className="mb-3">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
              >
                {company.website}
              </a>
            </div>
          )}
          {company.address && <div className="mb-3 text-white/70 font-medium">{company.address}</div>}
          {company.city && company.country && (
            <div className="mb-3 text-white/70 font-medium">
              {company.city}, {company.country}
            </div>
          )}
        </div>

        <div className="bg-black rounded-2xl shadow-2xl p-10 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-8">Reviews</h3>

          {reviewsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white/70 text-lg">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review, index) => (
                <ReviewCard key={review.id || index} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-white/70 text-center py-12 text-lg">No reviews available for this company.</p>
          )}
        </div>
      </div>
    </div>
  )
}
