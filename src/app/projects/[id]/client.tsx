"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { projects } from "@/lib/mockData";
import DocumentUploader from "@/components/DocumentUploader";
import InteractivePipeline from "@/components/InteractivePipeline";

type Tab = "upload" | "pipeline" | "results" | "reports";

export default function ProjectDetailClient() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id) || projects[0];
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { t } = useLanguage();

  const tabs: { key: Tab; label: string }[] = [
    { key: "upload", label: t("project.tab.documents") },
    { key: "pipeline", label: t("project.tab.pipeline") },
    { key: "results", label: t("project.tab.results") },
    { key: "reports", label: t("project.tab.reports") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-serif text-2xl font-semibold text-ink">{project.name}</h2>
          <span className="text-[11px] font-medium bg-blue-bg text-blue px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
            {project.status === "in_progress" ? t("status.in_progress") : project.status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span>{project.agency}</span>
          <span>&middot;</span>
          <span>{project.documentCount} {t("projects.documents")}</span>
          <span>&middot;</span>
          <span>{project.verifiedCount} {t("projects.verified")}</span>
          {project.rejectedCount > 0 && (
            <>
              <span>&middot;</span>
              <span className="text-red">{project.rejectedCount} {t("projects.flagged")}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-btn px-5 py-3 text-sm font-medium -mb-px transition-colors ${
              activeTab === tab.key ? "active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "upload" && (
        <div className="space-y-6">
          <DocumentUploader onUpload={setUploadedFiles} />

          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">{t("project.docCategories")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.documentCategories.length > 0 ? (
                project.documentCategories.map((cat) => (
                  <div key={cat.code} className="card p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-ink truncate">
                        {cat.code} — {cat.label.split(" — ")[1] || cat.label}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span>{cat.count} {t("docs.docs")}</span>
                      <span className={cat.verified === cat.count ? "text-emerald" : "text-amber"}>
                        {cat.verified}/{cat.count} {t("docs.verified")}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-line rounded-full h-1">
                      <div
                        className={`h-1 rounded-full ${cat.verified === cat.count ? "bg-emerald" : "bg-navy"}`}
                        style={{ width: `${cat.count > 0 ? (cat.verified / cat.count) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted col-span-full">{t("project.noCategories")}</p>
              )}
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="card p-5">
              <h3 className="font-serif font-semibold mb-3">{t("project.recentUploads")}</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center text-[10px] text-navy font-medium">
                        {i + 1}
                      </span>
                      <span className="text-slate">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-amber-bg text-amber px-1.5 py-0.5 rounded-sm">{t("project.pendingOCR")}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary text-sm px-4 py-2 mt-4">
                {t("project.startOCR")}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "pipeline" && <InteractivePipeline />}

      {activeTab === "results" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t("results.totalDocs"), value: project.documentCount },
              { label: t("results.verified"), value: project.verifiedCount, color: "text-emerald" },
              { label: t("results.pending"), value: project.documentCount - project.verifiedCount - project.rejectedCount, color: "text-amber" },
              { label: t("results.flagged"), value: project.rejectedCount, color: "text-red" },
            ].map((stat) => (
              <div key={stat.label} className="card p-5 text-center">
                <p className={`metric-num text-2xl ${stat.color || "text-navy"}`}>{stat.value}</p>
                <p className="text-xs text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h3 className="font-serif font-semibold text-lg mb-4">{t("results.byDocument")}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("results.document")}</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("results.category")}</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("results.type")}</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("results.score")}</th>
                    <th className="text-left py-2 font-medium text-muted text-xs uppercase">{t("results.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { doc: "แบบคำขอ_001.pdf", cat: "A", type: "PDF", score: 92, status: "verified" },
                    { doc: "หนังสือรับรอง_003.pdf", cat: "AA", type: "PDF", score: 88, status: "verified" },
                    { doc: "รายงานการเงิน_Q2.pdf", cat: "AB", type: "PDF", score: 95, status: "verified" },
                    { doc: "สัญญาจ้าง_สแกน.tiff", cat: "AC", type: "Scan", score: 71, status: "flagged" },
                    { doc: "หนังสือมอบอำนาจ.jpg", cat: "AD", type: "Image", score: 45, status: "rejected" },
                    { doc: "ทะเบียนพาณิชย์.pdf", cat: "BA", type: "PDF", score: 97, status: "verified" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-line-soft last:border-0">
                      <td className="py-2.5 pr-4 text-ink">{row.doc}</td>
                      <td className="py-2.5 pr-4 text-muted">{row.cat}</td>
                      <td className="py-2.5 pr-4 text-muted">{row.type}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`font-mono text-xs ${row.score >= 80 ? "text-emerald" : row.score >= 60 ? "text-amber" : "text-red"}`}>
                          {row.score}%
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                          row.status === "verified" ? "bg-emerald-bg text-emerald" :
                          row.status === "flagged" ? "bg-amber-bg text-amber" :
                          "bg-red-bg text-red"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-serif font-semibold text-lg mb-4">{t("results.aiDetails")}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-bg rounded-sm border border-emerald/20">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-emerald">แบบคำขอ_001.pdf — Verified (92%)</p>
                    <p className="text-xs text-muted mt-1">All required fields present and match. Cross-referenced with ระเบียบการจัดซื้อจัดจ้าง 2560 and หลักเกณฑ์หน่วยงาน A.</p>
                    <p className="text-xs text-muted mt-0.5">Knowledge matches: ระเบียบการคลัง (95%), วิธีการปฏิบัติงานหน่วยงาน A (88%)</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-amber-bg rounded-sm border border-amber/20">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber">สัญญาจ้าง_สแกน.tiff — Flagged (71%)</p>
                    <p className="text-xs text-muted mt-1">Low OCR confidence on signature field. Partial text extraction on Clause 7 (liability). Manual review recommended.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-bg rounded-sm border border-red/20">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red">หนังสือมอบอำนาจ.jpg — Rejected (45%)</p>
                    <p className="text-xs text-muted mt-1">Expired authorization date (2026-01-15). Missing authorized signatory signature. Not compliant with ระเบียบหน่วยงาน A ฉบับ 12/2568.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-serif font-semibold text-lg mb-4">{t("reports.generate")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: t("reports.compliance"), desc: t("reports.complianceDesc"), icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { title: t("reports.verificationLog"), desc: t("reports.verificationLogDesc"), icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                { title: t("reports.docStatus"), desc: t("reports.docStatusDesc"), icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { title: t("reports.agencySubmit"), desc: t("reports.agencySubmitDesc"), icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              ].map((report) => (
                <button key={report.title} className="card p-5 text-left hover:border-navy transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-sm bg-navy/5 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-navy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={report.icon} />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-ink group-hover:text-navy transition-colors">{report.title}</h4>
                      <p className="text-xs text-muted mt-1">{report.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-serif font-semibold text-lg mb-4">{t("reports.recent")}</h3>
            <div className="space-y-3">
              {[
                { name: "Compliance_Summary_prj-004_2026-08-02.pdf", date: "2026-08-02", size: "1.4 MB" },
                { name: "Verification_Log_prj-001_2026-08-01.pdf", date: "2026-08-01", size: "2.1 MB" },
                { name: "Document_Status_prj-002_2026-07-20.pdf", date: "2026-07-20", size: "890 KB" },
              ].map((r) => (
                <div key={r.name} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-red/60" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-ink">{r.name}</p>
                      <p className="text-xs text-muted">{r.date} &middot; {r.size}</p>
                    </div>
                  </div>
                  <button className="text-sm text-navy font-medium hover:underline">{t("general.download")}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
