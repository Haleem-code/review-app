"use client";
import { useFavoritesStore } from "@/stores/favoriteStore";
import { CompanyCard } from "@/components/CompanyCard";

export default function FavoritesPage() {
	const { favorites } = useFavoritesStore();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">My Favorite Companies</h1>
				{favorites.length === 0 ? (
					<div className="text-center text-gray-600">No favorites yet. Add companies to your favorites!</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{favorites.map(company => (
							<CompanyCard key={company.company_id} company={company} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
