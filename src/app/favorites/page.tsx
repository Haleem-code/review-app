"use client";
import { useFavoritesStore } from "@/stores/favoriteStore";
import { CompanyCard } from "@/components/CompanyCard";
import { useEffect } from "react";

export default function FavoritesPage() {
	const { favorites, initializeFavorites } = useFavoritesStore();
	useEffect(() => {
		initializeFavorites();
	}, [initializeFavorites]);

		return (
			<div className="min-h-screen bg-black">
				<nav className="bg-transparent mb-6">
				</nav>
				<div className="container mx-auto px-4 py-8">
					<h1 className="text-3xl font-bold text-white mb-6">Favorites</h1>
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
