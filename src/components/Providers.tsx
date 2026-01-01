"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </LanguageProvider>
  );
}
