"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCompanyDetails } from "@/lib/api";
import { Company } from "@/lib/types";

export default function CompanyPage() {
	const { domain } = useParams();
	const [company, setCompany] = useState<Company | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!domain) return;
		setLoading(true);
		getCompanyDetails(domain as string)
			.then((data) => {
				setCompany(data);
				setError(null);
			})
			.catch((err) => {
				setError(err.message || "Failed to fetch company details.");
				setCompany(null);
			})
			.finally(() => setLoading(false));
	}, [domain]);

	if (loading) return <div className="p-8 text-center">Loading...</div>;
	if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
	if (!company) return <div className="p-8 text-center">No company found.</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-white rounded-lg shadow-md p-8">
				<div className="flex items-center space-x-4 mb-6">
					{company.logo && (
						<img src={company.logo} alt={`${company.name} logo`} className="w-16 h-16 rounded-lg object-cover" />
					)}
					<div>
						<h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
						<p className="text-gray-600">{company.domain}</p>
					</div>
				</div>
				<div className="mb-4">
					<span className="font-semibold">Rating:</span> {company.rating?.toFixed(1)} / 5
				</div>
				<div className="mb-4">
					<span className="font-semibold">Reviews:</span> {company.review_count?.toLocaleString()}
				</div>
				{company.categories && company.categories.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{company.categories.map((cat) => (
							<span key={cat.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{cat.name}</span>
						))}
					</div>
				)}
				{company.website && (
					<div className="mb-2">
						<a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.website}</a>
					</div>
				)}
				{company.address && (
					<div className="mb-2 text-gray-700">{company.address}</div>
				)}
				{company.city && company.country && (
					<div className="mb-2 text-gray-700">{company.city}, {company.country}</div>
				)}
			</div>
		</div>
	);
}
