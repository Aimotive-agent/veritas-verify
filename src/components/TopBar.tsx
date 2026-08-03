"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

export default function TopBar() {
  const { t, currentLanguage, setLanguage } = useLanguage();

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-navy text-paper">
      <div className="flex items-center justify-between px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-gold flex items-center justify-center text-navy font-bold text-xs">
            V
          </div>
          <span className="font-serif font-semibold text-sm">{t("app.name")}</span>
        </Link>

        <div className="flex items-center gap-1 bg-navy-deep/30 rounded-sm p-1">
          <button
            onClick={() =>
              setLanguage(
                currentLanguage.code === "en"
                  ? { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" }
                  : { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" }
              )
            }
            className="text-xs font-medium px-2.5 py-1 rounded-sm transition-all text-white/80 hover:text-white hover:bg-white/5"
          >
            {currentLanguage.code === "en" ? "🇹🇭 TH" : "🇺🇸 EN"}
          </button>
        </div>
      </div>

      <nav className="flex overflow-x-auto px-4 pb-2 gap-1 border-t border-navy-deep/30 pt-2">
        {[
          { href: "/", label: t("nav.dashboard") },
          { href: "/projects", label: t("nav.projects") },
          { href: "/prompts", label: t("nav.prompts") },
          { href: "/knowledge", label: t("nav.knowledge") },
          { href: "/users", label: t("nav.users") },
          { href: "/admin", label: t("nav.admin") },
          { href: "/login", label: t("nav.login") },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[11px] font-medium px-3 py-1.5 rounded-sm whitespace-nowrap text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
