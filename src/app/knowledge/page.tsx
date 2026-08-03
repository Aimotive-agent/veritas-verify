"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import KnowledgeSearch from "@/components/KnowledgeSearch";

export default function KnowledgeBase() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-1">{t("kb.title")}</h2>
        <p className="text-sm text-muted">{t("kb.subtitle")}</p>
      </div>

      <KnowledgeSearch />

      <div>
        <h3 className="font-serif font-semibold text-lg mb-4">{t("kb.categories")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "ระเบียบการคลัง",
              subtitle: "การจัดซื้อจัดจ้างภาครัฐ",
              count: 156,
              desc: "ระเบียบกระทรวงการคลัง มติคณะรัฐมนตรี และประกาศคณะกรรมการวินิจฉัยที่เกี่ยวข้องกับการจัดซื้อจัดจ้าง",
            },
            {
              title: "นิติบุคคล (DBD)",
              subtitle: "ทะเบียนพาณิชย์และบัญชี",
              count: 89,
              desc: "หลักเกณฑ์การตรวจสอบนิติบุคคล หนังสือรับรอง ภ.พ.20 งบการเงิน และประวัตินิติบุคคล",
            },
            {
              title: "หน่วยงาน A",
              subtitle: "ระเบียบและหลักเกณฑ์เฉพาะ",
              count: 72,
              desc: "ประมวลระเบียบปฏิบัติ ประกาศหน่วยงาน และหลักเกณฑ์การตรวจสอบของหน่วยงาน A",
            },
            {
              title: "หน่วยงาน B",
              subtitle: "ระเบียบและหลักเกณฑ์เฉพาะ",
              count: 48,
              desc: "ประมวลระเบียบปฏิบัติ ประกาศหน่วยงาน และหลักเกณฑ์การประมูลของหน่วยงาน B",
            },
            {
              title: "หน่วยงาน C",
              subtitle: "ระเบียบและหลักเกณฑ์เฉพาะ",
              count: 35,
              desc: "ประมวลระเบียบปฏิบัติ การส่งเสริม และการตรวจสอบภายหลังของหน่วยงาน C",
            },
            {
              title: "วิธีการปฏิบัติงาน",
              subtitle: "คู่มือและมาตรฐาน",
              count: 27,
              desc: "คู่มือนักวิเคราะห์ มาตรฐานการตรวจสอบภายใน และวิธีการค้นหาข้อมูลตามวัตถุประสงค์",
            },
          ].map((cat) => (
            <div key={cat.title} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-serif font-semibold text-ink">{cat.title}</h4>
                  <p className="text-xs text-muted">{cat.subtitle}</p>
                </div>
                <span className="text-[11px] text-muted">{cat.count} {t("kb.articles")}</span>
              </div>
              <p className="text-xs text-slate leading-relaxed">{cat.desc}</p>
              <button className="text-xs text-navy font-medium mt-3 hover:underline">
                {t("kb.browseArticles")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
