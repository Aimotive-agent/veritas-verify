"use client";

import LanguageProvider from "@/contexts/LanguageContext";
import ConvexClientProvider from "@/components/ConvexClientProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </LanguageProvider>
  );
}
