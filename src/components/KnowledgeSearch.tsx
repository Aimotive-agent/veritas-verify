"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { KnowledgeArticle } from "@/lib/types";
import { knowledgeArticles } from "@/lib/mockData";

export default function KnowledgeSearch() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KnowledgeArticle[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearching(true);
    setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = knowledgeArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.regulations.some((r) => r.toLowerCase().includes(q)) ||
          a.agency.toLowerCase().includes(q)
      );
      setResults(filtered);
      setSearching(false);
    }, 800);
  };

  const n = results.length;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t("kb.searchPlaceholder")}
            className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white"
          />
        </div>
        <button onClick={handleSearch} className="btn-primary px-5 py-2.5 text-sm">
          {searching ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("kb.searching")}
            </span>
          ) : (
            t("kb.search")
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-3">{n} {n > 1 ? "results" : "result"} {t("kb.match")}</p>
          <div className="space-y-3">
            {results.map((article) => (
              <div key={article.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif font-semibold text-ink mb-1">{article.title}</h4>
                    <p className="text-xs text-muted mb-2">
                      {article.agency} &middot; {article.category}
                    </p>
                    <p className="text-sm text-slate leading-relaxed">{article.content}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {article.regulations.map((r) => (
                        <span key={r} className="text-[11px] bg-navy/10 text-navy px-2 py-0.5 rounded-sm">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-[10px] text-emerald bg-emerald-bg px-2 py-0.5 rounded-sm font-medium uppercase tracking-wider">
                      95% {t("kb.match")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!results.length && query && !searching && (
        <div className="card p-10 text-center">
          <p className="text-muted text-sm">{t("kb.noResults")}</p>
          <p className="text-xs text-muted mt-1">{t("kb.noResultsHint")}</p>
        </div>
      )}
    </div>
  );
}
