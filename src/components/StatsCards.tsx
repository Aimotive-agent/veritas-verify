"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/lib/mockData";

export default function StatsCards() {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-5">
        <p className="text-xs text-muted uppercase tracking-wider mb-2">{t("stats.totalProjects")}</p>
        <p className="metric-num text-2xl md:text-3xl text-navy">5</p>
        <p className="text-xs text-muted mt-1">3 {t("stats.active")}</p>
      </div>
      <div className="card p-5">
        <p className="text-xs text-muted uppercase tracking-wider mb-2">{t("stats.documentsVerified")}</p>
        <p className="metric-num text-2xl md:text-3xl text-emerald">44</p>
        <p className="text-xs text-muted mt-1">{t("stats.thisMonth")}</p>
      </div>
      <div className="card p-5">
        <p className="text-xs text-muted uppercase tracking-wider mb-2">{t("stats.pendingReview")}</p>
        <p className="metric-num text-2xl md:text-3xl text-amber">7</p>
        <p className="text-xs text-muted mt-1">{t("stats.awaitingAction")}</p>
      </div>
      <div className="card p-5">
        <p className="text-xs text-muted uppercase tracking-wider mb-2">{t("stats.flaggedIssues")}</p>
        <p className="metric-num text-2xl md:text-3xl text-red">3</p>
        <p className="text-xs text-muted mt-1">{t("stats.highSeverity")}</p>
      </div>
    </div>
  );
}
