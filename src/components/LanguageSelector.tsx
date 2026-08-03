"use client";

import { useLanguage, SUPPORTED_LANGUAGES } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-navy-deep/30 rounded-sm p-1">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang)}
          className={`text-xs px-2.5 py-1 rounded-sm transition-all font-medium ${
            currentLanguage.code === lang.code
              ? "bg-gold/20 text-gold"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          {lang.flag} {lang.nativeName}
        </button>
      ))}
    </div>
  );
}
