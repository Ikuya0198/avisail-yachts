"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, use } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getYachtById,
  getRelatedYachts,
  getYachtDisplayName,
  getYachtDescription,
  formatYachtPrice,
  yachtTypeLabels,
  statusLabels,
  Locale,
} from "@/lib/yachts";

interface Props {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  available: "bg-green-500/20 text-green-300 border-green-500/30",
  under_offer: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  sold: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function YachtDetailPage({ params }: Props) {
  const { id } = use(params);
  const yacht = getYachtById(id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { t, locale } = useLanguage();

  if (!yacht) {
    notFound();
  }

  const displayName = getYachtDisplayName(yacht, locale as Locale);
  const description = getYachtDescription(yacht, locale as Locale);
  const relatedYachts = getRelatedYachts(yacht, 3);
  const typeLabel = yachtTypeLabels[yacht.yacht_type]?.[locale === "ja" ? "ja" : "en"] || yacht.yacht_type_detail;
  const statusLabel = statusLabels[yacht.status]?.[locale === "ja" ? "ja" : "en"] || yacht.status;
  
  const engineInfo = yacht.engine_model ? yacht.engine_make + " " + yacht.engine_model : yacht.engine_make;

  const specs = [
    { label: locale === "ja" ? "全長" : "Length", value: yacht.length_m + "m (" + yacht.length_ft + "ft)" },
    { label: locale === "ja" ? "全幅" : "Beam", value: yacht.beam_m + "m" },
    { label: locale === "ja" ? "喫水" : "Draft", value: yacht.draft_m + "m" },
    { label: locale === "ja" ? "建造年" : "Year Built", value: String(yacht.year_built) },
    { label: locale === "ja" ? "ビルダー" : "Builder", value: yacht.builder },
    { label: locale === "ja" ? "船体素材" : "Hull Material", value: yacht.hull_material },
    { label: locale === "ja" ? "キャビン" : "Cabins", value: String(yacht.cabins) },
    { label: locale === "ja" ? "バース" : "Berths", value: String(yacht.berths) },
    { label: locale === "ja" ? "エンジン" : "Engine", value: engineInfo },
  ];
  
  if (yacht.engine_hours) {
    specs.push({ label: locale === "ja" ? "エンジン時間" : "Engine Hours", value: yacht.engine_hours + "h" });
  }
  if (yacht.max_speed_knots) {
    specs.push({ label: locale === "ja" ? "最高速度" : "Max Speed", value: yacht.max_speed_knots + " knots" });
  }
  if (yacht.cruise_speed_knots) {
    specs.push({ label: locale === "ja" ? "巡航速度" : "Cruise Speed", value: yacht.cruise_speed_knots + " knots" });
  }
  if (yacht.range_nm) {
    specs.push({ label: locale === "ja" ? "航続距離" : "Range", value: yacht.range_nm + " nm" });
  }
  specs.push({ label: locale === "ja" ? "燃料タンク" : "Fuel Capacity", value: yacht.fuel_capacity_l + "L" });
  specs.push({ label: locale === "ja" ? "清水タンク" : "Water Capacity", value: yacht.water_capacity_l + "L" });

  return (
    <div className="bg-navy min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-gold transition-colors">
              {t("common.home")}
            </Link>
            <span className="text-white/40">/</span>
            <Link href="/#collection" className="text-white/60 hover:text-gold transition-colors">
              {t("common.collection")}
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-gold">{displayName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-navy-light border border-gold/20 overflow-hidden">
              {/* Main Image */}
              <div className="aspect-[16/10] relative">
                <Image
                  src={yacht.images[selectedImageIndex] || yacht.thumbnail}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>

              {/* Thumbnail Strip */}
              {yacht.images.length > 1 && (
                <div className="p-4 bg-navy border-t border-gold/20">
                  <div className="flex gap-2 overflow-x-auto">
                    {yacht.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={"relative w-20 h-16 flex-shrink-0 overflow-hidden border-2 transition-all " + (selectedImageIndex === index ? "border-gold" : "border-transparent hover:border-gold/50")}
                      >
                        <Image
                          src={img}
                          alt={displayName + " - Image " + (index + 1)}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-navy-light border border-gold/20 p-6">
              <h2 className="font-serif text-2xl text-white mb-4">
                {locale === "ja" ? "概要" : "Overview"}
              </h2>
              <p className="text-white/70 leading-relaxed">{description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-navy-light border border-gold/20 p-6">
              <h2 className="font-serif text-2xl text-white mb-4">
                {locale === "ja" ? "ハイライト" : "Highlights"}
              </h2>
              <ul className="space-y-3">
                {yacht.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white/70">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="bg-navy-light border border-gold/20 p-6">
              <h2 className="font-serif text-2xl text-white mb-4">
                {locale === "ja" ? "スペック" : "Specifications"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec, index) => (
                  <div key={index} className="bg-navy/50 p-4 border border-gold/10">
                    <div className="text-gold/70 text-sm uppercase tracking-wider mb-1">
                      {spec.label}
                    </div>
                    <div className="text-white font-medium">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-navy-light border border-gold/20 p-6">
              <h2 className="font-serif text-2xl text-white mb-4">
                {locale === "ja" ? "装備" : "Equipment"}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {yacht.equipment.map((item, index) => (
                  <div key={index} className="flex items-center text-white/70">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full mr-2"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-navy-light border border-gold/20 p-6 sticky top-24">
              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <span className={"px-3 py-1 text-sm border " + statusColors[yacht.status]}>
                  {statusLabel}
                </span>
                <span className="text-gold text-sm uppercase tracking-wider">{typeLabel}</span>
              </div>

              {/* Name */}
              <h1 className="font-serif text-3xl text-white mb-2">{displayName}</h1>
              {yacht.name_ja && locale !== "ja" && (
                <p className="text-white/50 mb-4">{yacht.name_ja}</p>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="text-gold font-serif text-3xl">
                  {formatYachtPrice(yacht)}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center text-white/60 mb-6">
                <svg className="w-5 h-5 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {yacht.location}, {yacht.location_country}
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gold/20">
                <div>
                  <div className="text-gold/70 text-sm">{locale === "ja" ? "全長" : "Length"}</div>
                  <div className="text-white font-medium">{yacht.length_m}m</div>
                </div>
                <div>
                  <div className="text-gold/70 text-sm">{locale === "ja" ? "建造年" : "Year"}</div>
                  <div className="text-white font-medium">{yacht.year_built}</div>
                </div>
                <div>
                  <div className="text-gold/70 text-sm">{locale === "ja" ? "キャビン" : "Cabins"}</div>
                  <div className="text-white font-medium">{yacht.cabins}</div>
                </div>
                <div>
                  <div className="text-gold/70 text-sm">{locale === "ja" ? "バース" : "Berths"}</div>
                  <div className="text-white font-medium">{yacht.berths}</div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <a
                  href={"mailto:yachts@avisail.com?subject=Inquiry: " + displayName}
                  className="btn-luxury w-full text-center block"
                >
                  {locale === "ja" ? "お問い合わせ" : "Inquire Now"}
                </a>
                <a
                  href="https://wa.me/817093101362"
                  target="_blank"
                  className="border border-gold text-gold px-6 py-3 uppercase tracking-widest text-sm hover:bg-gold hover:text-navy transition-all flex items-center justify-center w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gold/20">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-white/60">
                    <svg className="w-4 h-4 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {locale === "ja" ? "プライベートビューイング可" : "Private viewing available"}
                  </div>
                  <div className="flex items-center text-sm text-white/60">
                    <svg className="w-4 h-4 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {locale === "ja" ? "シートライアル可能" : "Sea trial available"}
                  </div>
                  <div className="flex items-center text-sm text-white/60">
                    <svg className="w-4 h-4 mr-2 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {locale === "ja" ? "世界中への配送可" : "Worldwide delivery"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Yachts */}
        {relatedYachts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-3xl text-white mb-8">
              {locale === "ja" ? "関連するヨット" : "Similar Yachts"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedYachts.map((relatedYacht) => (
                <Link
                  key={relatedYacht.id}
                  href={"/yachts/" + relatedYacht.id}
                  className="group bg-navy-light border border-gold/20 hover:border-gold/50 transition-all overflow-hidden"
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image
                      src={relatedYacht.thumbnail}
                      alt={getYachtDisplayName(relatedYacht, locale as Locale)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-gold text-sm uppercase tracking-wider mb-1">
                      {yachtTypeLabels[relatedYacht.yacht_type]?.[locale === "ja" ? "ja" : "en"]}
                    </p>
                    <h3 className="font-serif text-xl text-white mb-2">
                      {getYachtDisplayName(relatedYacht, locale as Locale)}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">
                        {relatedYacht.length_m}m - {relatedYacht.year_built}
                      </span>
                      <span className="text-gold font-serif">
                        {formatYachtPrice(relatedYacht)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
