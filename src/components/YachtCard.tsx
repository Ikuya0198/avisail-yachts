"use client";

import Link from "next/link";
import Image from "next/image";
import { Yacht } from "@/types/yacht";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getYachtDisplayName, formatYachtPrice, yachtTypeLabels, statusLabels, Locale } from "@/lib/yachts";

interface YachtCardProps {
  yacht: Yacht;
}

const statusColors: Record<string, string> = {
  available: "bg-green-500/80",
  under_offer: "bg-yellow-500/80",
  sold: "bg-red-500/80",
};

export default function YachtCard({ yacht }: YachtCardProps) {
  const { locale } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const displayName = getYachtDisplayName(yacht, locale as Locale);
  const typeLabel = yachtTypeLabels[yacht.yacht_type]?.[locale === "ja" ? "ja" : "en"] || yacht.yacht_type_detail;
  const statusLabel = statusLabels[yacht.status]?.[locale === "ja" ? "ja" : "en"] || yacht.status;
  const isYachtFavorite = isFavorite(yacht.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(yacht.id);
  };

  return (
    <Link
      href={"/yachts/" + yacht.id}
      className="group relative bg-navy-light overflow-hidden border border-gold/20 hover:border-gold/50 transition-all duration-500"
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        <Image
          src={yacht.thumbnail}
          alt={displayName}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
        
        {/* Status Badge */}
        {yacht.status !== "available" && (
          <div className="absolute top-3 left-3">
            <span className={"px-2 py-1 text-xs text-white " + statusColors[yacht.status]}>
              {statusLabel}
            </span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={"absolute top-3 right-3 w-10 h-10 flex items-center justify-center transition-all " + (isYachtFavorite ? "bg-gold text-navy" : "bg-navy/60 text-white/80 hover:bg-gold hover:text-navy")}
        >
          <svg
            className="w-5 h-5"
            fill={isYachtFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gold text-sm uppercase tracking-wider mb-1">{typeLabel}</p>
            <h3 className="font-serif text-2xl text-white mb-2">{displayName}</h3>
            <div className="flex gap-4 text-white/60 text-sm">
              <span>{yacht.length_m}m</span>
              <span>-</span>
              <span>{yacht.year_built}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gold font-serif text-2xl">{formatYachtPrice(yacht)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
