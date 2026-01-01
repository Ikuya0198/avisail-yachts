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
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
