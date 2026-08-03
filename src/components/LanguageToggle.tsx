"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-navy rounded-sm p-1">
      {["en", "th"].map((code) => {
        const label = code === "en" ? "EN" : "TH";
        const flag = code === "en" ? "🇺🇸" : "🇹🇭";
        const active = currentLanguage.code === code;
        return (
          <button
            key={code}
            onClick={() => setLanguage(
              code === "en"
                ? { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" }
                : { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" }
            )}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-sm transition-all ${
              active
                ? "bg-gold/20 text-gold"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <span className="mr-1">{flag}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
