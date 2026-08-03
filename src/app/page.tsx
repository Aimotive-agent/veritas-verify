"use client";

import Link from "next/link";
import StatsCards from "@/components/StatsCards";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/lib/mockData";

const statusStyles = {
  draft: "bg-line text-muted",
  in_progress: "bg-blue-bg text-blue",
  completed: "bg-emerald-bg text-emerald",
  rejected: "bg-red-bg text-red",
};

export default function Dashboard() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-1">{t("dashboard.title")}</h2>
        <p className="text-sm text-muted">{t("dashboard.subtitle")}</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-semibold">{t("dashboard.recentProjects")}</h3>
            <Link href="/projects/new" className="btn-primary text-sm px-4 py-2">
              {t("dashboard.newProject")}
            </Link>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="card p-5 block group">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-serif font-semibold text-ink group-hover:text-navy transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-xs text-muted mt-1">{project.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                      <span>{project.agency}</span>
                      <span>&middot;</span>
                      <span>{project.documentCount} {t("projects.documents")}</span>
                      <span>&middot;</span>
                      <span>{project.verifiedCount} {t("projects.verified")}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-sm uppercase tracking-wider ${statusStyles[project.status]}`}>
                      {t(`status.${project.status}`)}
                    </span>
                    {project.rejectedCount > 0 && (
                      <span className="text-[11px] text-red">{project.rejectedCount} {t("projects.flagged")}</span>
                    )}
                  </div>
                </div>
                {project.documentCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <div className="w-full bg-line rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          project.status === "completed" ? "bg-emerald" : "bg-navy"
                        }`}
                        style={{ width: `${(project.verifiedCount / project.documentCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-serif font-semibold mb-4">{t("dashboard.systemComponents")}</h3>
            <div className="space-y-2.5">
              {[
                { label: t("system.ocr"), status: t("general.online"), icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" },
                { label: t("system.rag"), status: t("general.online"), icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                { label: t("system.aiVerify"), status: t("general.online"), icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                { label: t("system.lineAuth"), status: t("general.connected"), icon: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" },
                { label: t("system.apiGateway"), status: t("general.online"), icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { label: t("system.promptManager"), status: t("general.active"), icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
              ].map((comp) => (
                <div key={comp.label} className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-emerald flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={comp.icon} />
                  </svg>
                  <span className="flex-1 text-slate">{comp.label}</span>
                  <span className="text-[11px] font-medium text-emerald bg-emerald-bg px-2 py-0.5 rounded-sm">
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-serif font-semibold mb-4">{t("dashboard.knowledgeBases")}</h3>
            <div className="space-y-3">
              {[
                { label: "ระเบียบการคลัง (การจัดซื้อจัดจ้าง)", count: 156 },
                { label: "ระเบียบนิติบุคคล (DBD)", count: 89 },
                { label: "หลักเกณฑ์หน่วยงาน A", count: 72 },
                { label: "หลักเกณฑ์หน่วยงาน B", count: 48 },
                { label: "หลักเกณฑ์หน่วยงาน C", count: 35 },
              ].map((kb) => (
                <div key={kb.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate truncate">{kb.label}</span>
                  <span className="text-[11px] text-muted flex-shrink-0 ml-2">{kb.count} {t("kb.articles")}</span>
                </div>
              ))}
            </div>
            <Link href="/knowledge" className="text-xs text-navy font-medium mt-4 inline-block hover:underline">
              {t("dashboard.openKB")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
