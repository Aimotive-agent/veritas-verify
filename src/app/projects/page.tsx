"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/lib/mockData";

const statusStyles = {
  draft: "bg-line text-muted",
  in_progress: "bg-blue-bg text-blue",
  completed: "bg-emerald-bg text-emerald",
  rejected: "bg-red-bg text-red",
};

export default function Projects() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-ink mb-1">{t("projects.title")}</h2>
          <p className="text-sm text-muted">{t("projects.subtitle")}</p>
        </div>
        <Link href="/projects/new" className="btn-primary text-sm px-5 py-2.5">
          {t("dashboard.newProject")}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="card p-6 block group">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-serif font-semibold text-ink group-hover:text-navy transition-colors">
                {project.name}
              </h3>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-sm uppercase tracking-wider flex-shrink-0 ${statusStyles[project.status]}`}>
                {t(`status.${project.status}`)}
              </span>
            </div>
            <p className="text-sm text-slate mb-4">{project.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span>{project.agency}</span>
              <span>{project.documentCount} {t("projects.documents")}</span>
              <span>{project.verifiedCount} {t("projects.verified")}</span>
              {project.rejectedCount > 0 && <span className="text-red">{project.rejectedCount} {t("projects.flagged")}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
