"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { documentCategories } from "@/lib/mockData";

export default function NewProject() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("หน่วยงาน A");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    router.push("/projects/prj-new");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-1">{t("newProject.title")}</h2>
        <p className="text-sm text-muted">{t("newProject.subtitle")}</p>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">{t("newProject.name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("newProject.namePlaceholder")}
            className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">{t("newProject.agency")}</label>
          <select
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white"
          >
            <option value="หน่วยงาน A">หน่วยงาน A</option>
            <option value="หน่วยงาน B">หน่วยงาน B</option>
            <option value="หน่วยงาน C">หน่วยงาน C</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">{t("newProject.description")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder={t("newProject.descPlaceholder")}
            className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-3">{t("newProject.docCategories")}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {documentCategories.map((cat) => (
              <label key={cat.code} className="card p-3 flex items-center gap-3 cursor-pointer hover:border-muted">
                <input type="checkbox" defaultChecked={cat.required} className="rounded-sm text-navy focus:ring-navy" />
                <span className="text-sm text-slate truncate">{cat.label}</span>
                {cat.required && (
                  <span className="text-[10px] bg-red-bg text-red px-1.5 py-0.5 rounded-sm flex-shrink-0">{t("newProject.required")}</span>
                )}
              </label>
            ))}
          </div>
        </div>

        <button onClick={handleCreate} className="btn-primary w-full py-2.5 text-sm font-medium">
          {t("newProject.create")}
        </button>
      </div>
    </div>
  );
}
