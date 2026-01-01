"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useLanguage, locales, localeNames, localeFlags, Locale } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const { locale, setLocale, t } = useLanguage();
  const { favoritesCount } = useFavorites();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-md border-b border-gold/20">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 border-2 border-gold flex items-center justify-center">
            <span className="text-gold font-serif text-xl font-bold">A</span>
          </div>
          <div>
            <span className="text-white text-xl font-serif tracking-wide">Avisail</span>
            <span className="text-gold text-xl font-serif tracking-wide ml-1">Yachts</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#collection" className="text-white/80 hover:text-gold transition-colors uppercase text-sm tracking-widest">
            {t("common.collection")}
          </a>
          <a href="#services" className="text-white/80 hover:text-gold transition-colors uppercase text-sm tracking-widest">
            {t("common.services")}
          </a>
          <a href="#contact" className="text-white/80 hover:text-gold transition-colors uppercase text-sm tracking-widest">
            {t("common.contact")}
          </a>

          {/* Favorites Link */}
          <Link
            href="/favorites"
            className="text-white/80 hover:text-gold transition-colors flex items-center relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-navy text-xs flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </Link>

          <a
            href="https://avisail-vessel-trading.vercel.app"
            target="_blank"
            className="border border-white/30 text-white/80 hover:bg-white/10 hover:text-white px-4 py-2 text-sm tracking-wider transition-all flex items-center"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            {t("nav.workVessels")}
          </a>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-2 text-white/80 hover:text-gold transition-colors bg-white/5 px-3 py-2 border border-white/20"
            >
              <span>{localeFlags[locale]}</span>
              <span className="text-sm">{localeNames[locale]}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-navy border border-gold/30 shadow-lg py-1 z-50">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocale(loc);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gold/10 flex items-center space-x-2 ${
                      locale === loc ? "bg-gold/20 text-gold" : "text-white/80"
                    }`}
                  >
                    <span>{localeFlags[loc]}</span>
                    <span>{localeNames[loc]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Favorites */}
          <Link href="/favorites" className="text-white/80 hover:text-gold relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-navy text-xs flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Mobile Language */}
          <button
            onClick={() => {
              const nextIndex = (locales.indexOf(locale) + 1) % locales.length;
              setLocale(locales[nextIndex]);
            }}
            className="text-xl"
          >
            {localeFlags[locale]}
          </button>

          <button
            type="button"
            className="text-white/80 hover:text-gold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy/95 backdrop-blur-md border-t border-gold/20 px-6 py-4">
          <div className="flex flex-col space-y-4">
            <a
              href="#collection"
              className="text-white/80 hover:text-gold uppercase text-sm tracking-widest"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("common.collection")}
            </a>
            <a
              href="#services"
              className="text-white/80 hover:text-gold uppercase text-sm tracking-widest"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("common.services")}
            </a>
            <a
              href="#contact"
              className="text-white/80 hover:text-gold uppercase text-sm tracking-widest"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("common.contact")}
            </a>
            <a
              href="https://avisail-vessel-trading.vercel.app"
              target="_blank"
              className="text-white/80 hover:text-gold uppercase text-sm tracking-widest flex items-center"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              {t("nav.workVessels")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
