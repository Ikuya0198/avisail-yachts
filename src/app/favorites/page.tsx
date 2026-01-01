"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getAllYachts } from "@/lib/yachts";
import YachtCard from "@/components/YachtCard";

export default function FavoritesPage() {
  const { t, locale } = useLanguage();
  const { favorites, favoritesCount } = useFavorites();
  const allYachts = getAllYachts();
  
  const favoriteYachts = allYachts.filter((yacht) => favorites.includes(yacht.id));

  return (
    <div className="bg-navy min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link href="/" className="text-white/60 hover:text-gold transition-colors">
              {t("common.home")}
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-gold">
              {locale === "ja" ? "お気に入り" : locale === "ar" ? "المفضلة" : "Favorites"}
            </span>
          </nav>
          
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
            {locale === "ja" ? "お気に入りのヨット" : locale === "ar" ? "اليخوت المفضلة" : "Your Favorites"}
          </h1>
          <p className="text-white/60">
            {favoritesCount === 0 
              ? (locale === "ja" ? "お気に入りに追加されたヨットはありません" : locale === "ar" ? "لا توجد يخوت مفضلة" : "No yachts saved yet")
              : (locale === "ja" 
                  ? favoritesCount + "隻のヨットがお気に入りに追加されています" 
                  : locale === "ar"
                    ? favoritesCount + " يخت في المفضلة"
                    : favoritesCount + " yacht" + (favoritesCount === 1 ? "" : "s") + " saved"
                )
            }
          </p>
        </div>

        {/* Empty State */}
        {favoriteYachts.length === 0 ? (
          <div className="text-center py-16 border border-gold/20 bg-navy-light">
            <svg className="w-16 h-16 mx-auto text-gold/40 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="font-serif text-2xl text-white mb-4">
              {locale === "ja" ? "お気に入りがありません" : locale === "ar" ? "لا توجد مفضلات" : "No favorites yet"}
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              {locale === "ja" 
                ? "コレクションからお気に入りのヨットを追加してください"
                : locale === "ar"
                  ? "أضف يخوتك المفضلة من المجموعة"
                  : "Browse our collection and add yachts you love to your favorites"
              }
            </p>
            <Link href="/#collection" className="btn-luxury inline-block">
              {locale === "ja" ? "コレクションを見る" : locale === "ar" ? "تصفح المجموعة" : "Browse Collection"}
            </Link>
          </div>
        ) : (
          /* Yacht Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {favoriteYachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
