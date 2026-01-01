"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-light border-t border-gold/20 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 border-2 border-gold flex items-center justify-center">
                <span className="text-gold font-serif text-xl font-bold">A</span>
              </div>
              <div>
                <span className="text-white text-xl font-serif">Avisail</span>
                <span className="text-gold text-xl font-serif ml-1">Yachts</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="text-gold uppercase text-sm tracking-widest mb-6">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              <li><a href="#collection" className="text-white/60 hover:text-gold transition-colors">{t("footer.ourCollection")}</a></li>
              <li><a href="#services" className="text-white/60 hover:text-gold transition-colors">{t("footer.premiumServices")}</a></li>
              <li><a href="#contact" className="text-white/60 hover:text-gold transition-colors">{t("footer.contactUs")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold uppercase text-sm tracking-widest mb-6">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-white/60">
              <li>yachts@avisail.com</li>
              <li>WhatsApp: +81 70-9310-1362</li>
              <li>Tokyo, Japan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-12 pt-8 text-center text-white/40 text-sm">
          &copy; {new Date().getFullYear()} Avisail Yachts. {t("footer.allRights")}
        </div>
      </div>
    </footer>
  );
}
