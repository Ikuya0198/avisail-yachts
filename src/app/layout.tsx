import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    "motor yacht",
    "sailing yacht",
    "catamaran",
    "Japan yacht broker",
  ],
  authors: [{ name: "Avisail" }],
  creator: "Avisail",
  publisher: "Avisail",
  metadataBase: new URL("https://avisail-yachts.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://avisail-yachts.vercel.app",
    siteName: "Avisail Yachts",
    title: "Avisail Yachts - Luxury Japanese Yachts",
    description:
      "Discover exceptional Japanese luxury yachts. Curated selection of premium vessels for discerning buyers worldwide.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Luxury yacht cruising in Japanese waters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avisail Yachts - Luxury Japanese Yachts",
    description:
      "Discover exceptional Japanese luxury yachts. Premium vessels for discerning buyers worldwide.",
    images: ["https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&h=630&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
