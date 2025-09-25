"use client"
import Link from "next/link"
import type { Company } from "@/lib/types"
import { FavoriteButton } from "./FavoriteButton"
import { Star, Users } from "lucide-react"

interface CompanyCardProps {
  company: Company
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-white/30"
        }`}
      />
    ))
  }

  const handleViewReviews = () => {
    sessionStorage.setItem(`company-${company.domain}`, JSON.stringify(company))
  }

  return (
    <div className="bg-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-8 border border-white/10 hover:border-white/20 group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          {company.logo && (
            <img
              src={company.logo || "/placeholder.svg"}
              alt={`${company.name} logo`}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/10"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">{company.name}</h3>
            <p className="text-sm text-white/60 font-medium">{company.domain}</p>
          </div>
        </div>
        <FavoriteButton company={company} />
      </div>

      <div className="flex items-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">{renderStars(company.rating)}</div>
          <span className="text-sm font-semibold text-white ml-1">{company.rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-white/70">
          <Users className="w-4 h-4" />
          <span className="font-medium">{company.review_count.toLocaleString()} reviews</span>
        </div>
      </div>

      {company.categories && company.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {company.categories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-white/10 text-white/80 text-xs font-medium rounded-full border border-white/10"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/company/${company.domain}`}
        onClick={handleViewReviews}
        className="block w-full text-center bg-white hover:bg-white/90 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 group-hover:shadow-lg"
      >
        View Reviews
      </Link>
    </div>
  )
}
