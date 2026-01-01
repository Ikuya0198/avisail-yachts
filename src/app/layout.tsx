import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Avisail Yachts - Luxury Japanese Yachts",
    template: "%s | Avisail Yachts",
  },
  description:
    "Discover exceptional Japanese luxury yachts. Curated selection of premium vessels for discerning buyers worldwide.",
  keywords: [
    "luxury yachts",
    "Japanese yachts",
    "yacht sales",
    "premium boats",
    "yacht broker",
    "superyacht",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        {/* Header */}
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

            <div className="hidden md:flex items-center space-x-8">
              <a href="#collection" className="text-white/80 hover:text-gold transition-colors uppercase text-sm tracking-widest">
                Collection
              </a>
              <a href="#services" className="text-white/80 hover:text-gold transition-colors uppercase text-sm tracking-widest">
                Services
              </a>
              <a href="#contact" className="text-white/80 hover:text-gold transition-colors uppercase text-sm tracking-widest">
                Contact
              </a>
              <a
                href="https://avisail-vessel-trading.vercel.app"
                target="_blank"
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                Work Vessels &rarr;
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        {/* Footer */}
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
                  Curating exceptional Japanese yachts for discerning buyers worldwide.
                  Experience maritime luxury with uncompromising quality.
                </p>
              </div>

              <div>
                <h4 className="text-gold uppercase text-sm tracking-widest mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  <li><a href="#collection" className="text-white/60 hover:text-gold transition-colors">Our Collection</a></li>
                  <li><a href="#services" className="text-white/60 hover:text-gold transition-colors">Premium Services</a></li>
                  <li><a href="#contact" className="text-white/60 hover:text-gold transition-colors">Contact Us</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-gold uppercase text-sm tracking-widest mb-6">Contact</h4>
                <ul className="space-y-3 text-white/60">
                  <li>yachts@avisail.com</li>
                  <li>WhatsApp: +81 70-9310-1362</li>
                  <li>Tokyo, Japan</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gold/20 mt-12 pt-8 text-center text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Avisail Yachts. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
