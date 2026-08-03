"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PromptTemplate {
  id: string;
  docType: string;
  labelEn: string;
  labelTh: string;
  categoryEn: string;
  categoryTh: string;
  prompt: string;
  defaultPrompt: string;
  lastEdited?: string;
}

const defaultPrompts: PromptTemplate[] = [
  {
    id: "prompt-1",
    docType: "A",
    labelEn: "Patient Admission Form",
    labelTh: "แบบฟอร์มรับผู้ป่วย",
    categoryEn: "Patient Identity",
    categoryTh: "ข้อมูลผู้ป่วย",
    prompt: "Extract the following fields from this patient admission form:\n- Patient full name (Thai and English)\n- 13-digit Thai National ID number\n- Date of birth (DD/MM/YYYY)\n- Admission date\n- Hospital number (HN)\n- Treating physician name\n\nดึงข้อมูลต่อไปนี้จากแบบฟอร์มรับผู้ป่วย:\n- ชื่อ-นามสกุลผู้ป่วย (ไทยและอังกฤษ)\n- เลขบัตรประชาชน 13 หลัก\n- วันเดือนปีเกิด (วว/ดด/ปปปป)\n- วันที่เข้ารับการรักษา\n- หมายเลขโรงพยาบาล (HN)\n- ชื่อแพทย์ผู้รักษา\n\nReturn as JSON. Flag any missing required fields.\nส่งคืนเป็น JSON ระบุข้อมูลที่จำเป็นที่ขาดหายไป",
    defaultPrompt: "Extract the following fields from this patient admission form:\n- Patient full name (Thai and English)\n- 13-digit Thai National ID number\n- Date of birth (DD/MM/YYYY)\n- Admission date\n- Hospital number (HN)\n- Treating physician name\n\nดึงข้อมูลต่อไปนี้จากแบบฟอร์มรับผู้ป่วย:\n- ชื่อ-นามสกุลผู้ป่วย (ไทยและอังกฤษ)\n- เลขบัตรประชาชน 13 หลัก\n- วันเดือนปีเกิด (วว/ดด/ปปปป)\n- วันที่เข้ารับการรักษา\n- หมายเลขโรงพยาบาล (HN)\n- ชื่อแพทย์ผู้รักษา\n\nReturn as JSON. Flag any missing required fields.\nส่งคืนเป็น JSON ระบุข้อมูลที่จำเป็นที่ขาดหายไป",
  },
  {
    id: "prompt-2",
    docType: "B",
    labelEn: "Insurance Claim Form",
    labelTh: "แบบฟอร์มเคลมประกัน",
    categoryEn: "Insurance & Claims",
    categoryTh: "ประกันและการเคลม",
    prompt: "Extract the following fields from this insurance claim form:\n- Patient name and ID\n- Insurance provider name\n- Policy number\n- Diagnosis codes (ICD-10)\n- Treatment codes\n- Total claimed amount (THB)\n- Date of service\n\nCross-reference treatment costs against NHSO reimbursement rates. Flag amounts exceeding standard rates. Return as JSON.\n\nดึงข้อมูลต่อไปนี้จากแบบฟอร์มเคลมประกัน:\n- ชื่อผู้ป่วยและเลขบัตรประชาชน\n- ชื่อบริษัทประกัน\n- หมายเลขกรมธรรม์\n- รหัสวินิจฉัยโรค (ICD-10)\n- รหัสการรักษา\n- จำนวนเงินที่เคลม (บาท)\n- วันที่ให้บริการ\n\nตรวจสอบค่ารักษากับอัตราการเบิกจ่ายของ สปสช. ระบุจำนวนเงินที่เกินอัตรามาตรฐาน ส่งคืนเป็น JSON",
    defaultPrompt: "Extract the following fields from this insurance claim form:\n- Patient name and ID\n- Insurance provider name\n- Policy number\n- Diagnosis codes (ICD-10)\n- Treatment codes\n- Total claimed amount (THB)\n- Date of service\n\nCross-reference treatment costs against NHSO reimbursement rates. Flag amounts exceeding standard rates. Return as JSON.\n\nดึงข้อมูลต่อไปนี้จากแบบฟอร์มเคลมประกัน:\n- ชื่อผู้ป่วยและเลขบัตรประชาชน\n- ชื่อบริษัทประกัน\n- หมายเลขกรมธรรม์\n- รหัสวินิจฉัยโรค (ICD-10)\n- รหัสการรักษา\n- จำนวนเงินที่เคลม (บาท)\n- วันที่ให้บริการ\n\nตรวจสอบค่ารักษากับอัตราการเบิกจ่ายของ สปสช. ระบุจำนวนเงินที่เกินอัตรามาตรฐาน ส่งคืนเป็น JSON",
  },
  {
    id: "prompt-3",
    docType: "C",
    labelEn: "Vendor Quotation",
    labelTh: "ใบเสนอราคาผู้ขาย",
    categoryEn: "Procurement",
    categoryTh: "การจัดซื้อจัดจ้าง",
    prompt: "Extract the following fields from this vendor quotation:\n- Vendor company name (Thai and English)\n- Tax ID number (13 digits)\n- Quotation reference number\n- Item/service descriptions with unit prices\n- Total quotation amount (THB inclusive of VAT)\n- Validity period\n- Authorized signatory name and title\n\nVerify vendor tax ID against DBD database. Check if total amount falls within hospital procurement thresholds per ระเบียบการคลัง 2560. Return as JSON.\n\nดึงข้อมูลต่อไปนี้จากใบเสนอราคา:\n- ชื่อบริษัทผู้ขาย (ไทยและอังกฤษ)\n- เลขประจำตัวผู้เสียภาษี 13 หลัก\n- เลขที่อ้างอิงใบเสนอราคา\n- รายการสินค้า/บริการพร้อมราคาต่อหน่วย\n- ราคารวม (บาท รวมภาษีมูลค่าเพิ่ม)\n- ระยะเวลามีผล\n- ชื่อและตำแหน่งผู้มีอำนาจลงนาม\n\nตรวจสอบเลขภาษีผู้ขายกับฐานข้อมูล DBD ตรวจสอบว่าราคาอยู่ในกรอบการจัดซื้อของโรงพยาบาลตามระเบียบการคลัง 2560 ส่งคืนเป็น JSON",
    defaultPrompt: "Extract the following fields from this vendor quotation:\n- Vendor company name (Thai and English)\n- Tax ID number (13 digits)\n- Quotation reference number\n- Item/service descriptions with unit prices\n- Total quotation amount (THB inclusive of VAT)\n- Validity period\n- Authorized signatory name and title\n\nVerify vendor tax ID against DBD database. Check if total amount falls within hospital procurement thresholds per ระเบียบการคลัง 2560. Return as JSON.\n\nดึงข้อมูลต่อไปนี้จากใบเสนอราคา:\n- ชื่อบริษัทผู้ขาย (ไทยและอังกฤษ)\n- เลขประจำตัวผู้เสียภาษี 13 หลัก\n- เลขที่อ้างอิงใบเสนอราคา\n- รายการสินค้า/บริการพร้อมราคาต่อหน่วย\n- ราคารวม (บาท รวมภาษีมูลค่าเพิ่ม)\n- ระยะเวลามีผล\n- ชื่อและตำแหน่งผู้มีอำนาจลงนาม\n\nตรวจสอบเลขภาษีผู้ขายกับฐานข้อมูล DBD ตรวจสอบว่าราคาอยู่ในกรอบการจัดซื้อของโรงพยาบาลตามระเบียบการคลัง 2560 ส่งคืนเป็น JSON",
  },
  {
    id: "prompt-4",
    docType: "D",
    labelEn: "Financial Audit Receipt",
    labelTh: "ใบเสร็จรับเงินการตรวจสอบบัญชี",
    categoryEn: "Finance & Audit",
    categoryTh: "การเงินและการตรวจสอบ",
    prompt: "Extract the following fields from this financial receipt:\n- Receipt number\n- Payee name\n- Amount (THB)\n- Date of payment\n- Payment method\n- VAT amount and VAT registration number\n- Department/budget code\n- Authorizing officer name\n\nValidate receipt against Ministry of Finance audit regulations. Check number sequencing for duplicates. Flag amounts above departmental spending limits. Return as JSON.\n\nดึงข้อมูลต่อไปนี้จากใบเสร็จรับเงิน:\n- เลขที่ใบเสร็จ\n- ชื่อผู้รับเงิน\n- จำนวนเงิน (บาท)\n- วันที่ชำระเงิน\n- วิธีการชำระเงิน\n- จำนวนภาษีมูลค่าเพิ่มและเลขทะเบียนภาษีมูลค่าเพิ่ม\n- รหัสแผนก/งบประมาณ\n- ชื่อผู้มีอำนาจอนุมัติ\n\nตรวจสอบใบเสร็จตามระเบียบการตรวจสอบของกระทรวงการคลัง ตรวจสอบลำดับเลขที่เพื่อหาการซ้ำซ้อน ระบุจำนวนเงินที่เกินวงเงินของแผนก ส่งคืนเป็น JSON",
    defaultPrompt: "Extract the following fields from this financial receipt:\n- Receipt number\n- Payee name\n- Amount (THB)\n- Date of payment\n- Payment method\n- VAT amount and VAT registration number\n- Department/budget code\n- Authorizing officer name\n\nValidate receipt against Ministry of Finance audit regulations. Check number sequencing for duplicates. Flag amounts above departmental spending limits. Return as JSON.\n\nดึงข้อมูลต่อไปนี้จากใบเสร็จรับเงิน:\n- เลขที่ใบเสร็จ\n- ชื่อผู้รับเงิน\n- จำนวนเงิน (บาท)\n- วันที่ชำระเงิน\n- วิธีการชำระเงิน\n- จำนวนภาษีมูลค่าเพิ่มและเลขทะเบียนภาษีมูลค่าเพิ่ม\n- รหัสแผนก/งบประมาณ\n- ชื่อผู้มีอำนาจอนุมัติ\n\nตรวจสอบใบเสร็จตามระเบียบการตรวจสอบของกระทรวงการคลัง ตรวจสอบลำดับเลขที่เพื่อหาการซ้ำซ้อน ระบุจำนวนเงินที่เกินวงเงินของแผนก ส่งคืนเป็น JSON",
  },
  {
    id: "prompt-5",
    docType: "AA",
    labelEn: "Certificate of Registration",
    labelTh: "หนังสือรับรองการจดทะเบียน",
    categoryEn: "Legal Documents",
    categoryTh: "เอกสารทางกฎหมาย",
    prompt: "Extract the following fields from this company registration certificate:\n- Company name (Thai and English)\n- Company registration number\n- Registration date\n- Registered capital\n- Company type (บริษัทจำกัด/ห้างหุ้นส่วนจำกัด/บริษัทมหาชน)\n- List of authorized directors with signatures\n- Business objectives\n\nVerify company status with DBD e-Service. Check for any pending dissolution or suspension notices. Return as JSON.\n\nดึงข้อมูลต่อไปนี้จากหนังสือรับรองการจดทะเบียน:\n- ชื่อบริษัท (ไทยและอังกฤษ)\n- เลขทะเบียนบริษัท\n- วันที่จดทะเบียน\n- ทุนจดทะเบียน\n- ประเภทบริษัท (บริษัทจำกัด/ห้างหุ้นส่วนจำกัด/บริษัทมหาชน)\n- รายชื่อกรรมการผู้มีอำนาจพร้อมลายเซ็น\n- วัตถุประสงค์ทางธุรกิจ\n\nตรวจสอบสถานะบริษัทกับ DBD e-Service ตรวจสอบการถูกเพิกถอนหรือระงับกิจการ ส่งคืนเป็น JSON",
    defaultPrompt: "Extract the following fields from this company registration certificate:\n- Company name (Thai and English)\n- Company registration number\n- Registration date\n- Registered capital\n- Company type (บริษัทจำกัด/ห้างหุ้นส่วนจำกัด/บริษัทมหาชน)\n- List of authorized directors with signatures\n- Business objectives\n\nVerify company status with DBD e-Service. Check for any pending dissolution or suspension notices. Return as JSON.\n\nดึงข้อมูลต่อไปนี้จากหนังสือรับรองการจดทะเบียน:\n- ชื่อบริษัท (ไทยและอังกฤษ)\n- เลขทะเบียนบริษัท\n- วันที่จดทะเบียน\n- ทุนจดทะเบียน\n- ประเภทบริษัท (บริษัทจำกัด/ห้างหุ้นส่วนจำกัด/บริษัทมหาชน)\n- รายชื่อกรรมการผู้มีอำนาจพร้อมลายเซ็น\n- วัตถุประสงค์ทางธุรกิจ\n\nตรวจสอบสถานะบริษัทกับ DBD e-Service ตรวจสอบการถูกเพิกถอนหรือระงับกิจการ ส่งคืนเป็น JSON",
  },
  {
    id: "prompt-6",
    docType: "AB",
    labelEn: "Financial Report",
    labelTh: "รายงานทางการเงิน",
    categoryEn: "Finance & Audit",
    categoryTh: "การเงินและการตรวจสอบ",
    prompt: "ดึงข้อมูลต่อไปนี้จากรายงานทางการเงิน:\n- รอบระยะเวลารายงาน\n- รายได้รวม\n- ค่าใช้จ่ายรวม\n- กำไร/ขาดทุนสุทธิ\n- ยอดรวมงบดุล (สินทรัพย์, หนี้สิน, ส่วนของผู้ถือหุ้น)\n- ชื่อผู้สอบบัญชีและเลขที่ใบอนุญาต\n- วันที่ของรายงานการสอบบัญชี\n\nตรวจสอบอัตราส่วนทางการเงินกับเกณฑ์มาตรฐานอุตสาหกรรม ระบุคำเตือนความต่อเนื่องของกิจการหรืองบการเงินที่มีเงื่อนไข ส่งคืนเป็น JSON\n\nExtract from financial report:\n- Reporting period, total revenue, total expenses, net profit/loss\n- Balance sheet totals\n- Auditor name and license number, date of audit opinion\n\nValidate financial ratios against benchmarks. Flag going-concern warnings. Return as JSON.",
    defaultPrompt: "ดึงข้อมูลต่อไปนี้จากรายงานทางการเงิน:\n- รอบระยะเวลารายงาน\n- รายได้รวม\n- ค่าใช้จ่ายรวม\n- กำไร/ขาดทุนสุทธิ\n- ยอดรวมงบดุล (สินทรัพย์, หนี้สิน, ส่วนของผู้ถือหุ้น)\n- ชื่อผู้สอบบัญชีและเลขที่ใบอนุญาต\n- วันที่ของรายงานการสอบบัญชี\n\nตรวจสอบอัตราส่วนทางการเงินกับเกณฑ์มาตรฐานอุตสาหกรรม ระบุคำเตือนความต่อเนื่องของกิจการหรืองบการเงินที่มีเงื่อนไข ส่งคืนเป็น JSON\n\nExtract from financial report:\n- Reporting period, total revenue, total expenses, net profit/loss\n- Balance sheet totals\n- Auditor name and license number, date of audit opinion\n\nValidate financial ratios against benchmarks. Flag going-concern warnings. Return as JSON.",
  },
  {
    id: "prompt-7",
    docType: "BA",
    labelEn: "Commercial Registration",
    labelTh: "ทะเบียนพาณิชย์",
    categoryEn: "Legal Documents",
    categoryTh: "เอกสารทางกฎหมาย",
    prompt: "ดึงข้อมูลต่อไปนี้จากทะเบียนพาณิชย์:\n- ชื่อธุรกิจ\n- เลขทะเบียน\n- ประเภทการประกอบธุรกิจ\n- ที่อยู่ตามทะเบียน\n- ชื่อเจ้าของ/หุ้นส่วน\n- วันที่จดทะเบียนและต่ออายุล่าสุด\n\nตรวจสอบสถานะการจดทะเบียนกับ DBD ตรวจสอบการหมดอายุของทะเบียน ส่งคืนเป็น JSON\n\nExtract from commercial registration:\n- Business name, registration number, business type, address\n- Owner/partner names, registration date, last renewal\n\nVerify registration with DBD. Flag expired registrations. Return as JSON.",
    defaultPrompt: "ดึงข้อมูลต่อไปนี้จากทะเบียนพาณิชย์:\n- ชื่อธุรกิจ\n- เลขทะเบียน\n- ประเภทการประกอบธุรกิจ\n- ที่อยู่ตามทะเบียน\n- ชื่อเจ้าของ/หุ้นส่วน\n- วันที่จดทะเบียนและต่ออายุล่าสุด\n\nตรวจสอบสถานะการจดทะเบียนกับ DBD ตรวจสอบการหมดอายุของทะเบียน ส่งคืนเป็น JSON\n\nExtract from commercial registration:\n- Business name, registration number, business type, address\n- Owner/partner names, registration date, last renewal\n\nVerify registration with DBD. Flag expired registrations. Return as JSON.",
  },
  {
    id: "prompt-8",
    docType: "EA",
    labelEn: "Safety Certificate",
    labelTh: "ใบรับรองความปลอดภัย",
    categoryEn: "Compliance",
    categoryTh: "การปฏิบัติตามข้อกำหนด",
    prompt: "ดึงข้อมูลต่อไปนี้จากใบรับรองความปลอดภัย:\n- หมายเลขใบรับรอง\n- หน่วยงานผู้ออก\n- ชื่อสถานที่/โรงงาน\n- ขอบเขตการรับรอง\n- วันที่ออกและวันหมดอายุ\n- ชื่อผู้ตรวจสอบ\n- ข้อบกพร่องที่พบ\n\nตรวจสอบใบรับรองกับมาตรฐานความปลอดภัยของกระทรวงสาธารณสุข ระบุใบรับรองที่หมดอายุหรือใกล้หมดอายุ ส่งคืนเป็น JSON\n\nExtract from safety certificate:\n- Certificate number, issuing authority, facility/site name\n- Scope, issue date, expiry, auditor name\n- Non-conformances noted\n\nValidate against Ministry of Public Health safety standards. Flag expired certificates. Return as JSON.",
    defaultPrompt: "ดึงข้อมูลต่อไปนี้จากใบรับรองความปลอดภัย:\n- หมายเลขใบรับรอง\n- หน่วยงานผู้ออก\n- ชื่อสถานที่/โรงงาน\n- ขอบเขตการรับรอง\n- วันที่ออกและวันหมดอายุ\n- ชื่อผู้ตรวจสอบ\n- ข้อบกพร่องที่พบ\n\nตรวจสอบใบรับรองกับมาตรฐานความปลอดภัยของกระทรวงสาธารณสุข ระบุใบรับรองที่หมดอายุหรือใกล้หมดอายุ ส่งคืนเป็น JSON\n\nExtract from safety certificate:\n- Certificate number, issuing authority, facility/site name\n- Scope, issue date, expiry, auditor name\n- Non-conformances noted\n\nValidate against Ministry of Public Health safety standards. Flag expired certificates. Return as JSON.",
  },
  {
    id: "prompt-9",
    docType: "FA",
    labelEn: "Operating License",
    labelTh: "ใบอนุญาตประกอบกิจการ",
    categoryEn: "Compliance",
    categoryTh: "การปฏิบัติตามข้อกำหนด",
    prompt: "ดึงข้อมูลต่อไปนี้จากใบอนุญาตประกอบกิจการ:\n- เลขที่ใบอนุญาต\n- ประเภทใบอนุญาต\n- ชื่อผู้ได้รับอนุญาต\n- หน่วยงานผู้ออก\n- วันที่ออกและวันหมดอายุ\n- กิจกรรม/ขอบเขตที่ได้รับอนุญาต\n- ข้อจำกัดหรือเงื่อนไข\n\nตรวจสอบความถูกต้องของใบอนุญาตกับหน่วยงานผู้ออก ระบุใบอนุญาตที่หมดอายุ ส่งคืนเป็น JSON\n\nExtract from operating license:\n- License number, license type, licensed entity name\n- Issuing authority, issue date, expiry\n- Licensed activities/scope, restrictions or conditions\n\nVerify license validity. Flag expired licenses. Return as JSON.",
    defaultPrompt: "ดึงข้อมูลต่อไปนี้จากใบอนุญาตประกอบกิจการ:\n- เลขที่ใบอนุญาต\n- ประเภทใบอนุญาต\n- ชื่อผู้ได้รับอนุญาต\n- หน่วยงานผู้ออก\n- วันที่ออกและวันหมดอายุ\n- กิจกรรม/ขอบเขตที่ได้รับอนุญาต\n- ข้อจำกัดหรือเงื่อนไข\n\nตรวจสอบความถูกต้องของใบอนุญาตกับหน่วยงานผู้ออก ระบุใบอนุญาตที่หมดอายุ ส่งคืนเป็น JSON\n\nExtract from operating license:\n- License number, license type, licensed entity name\n- Issuing authority, issue date, expiry\n- Licensed activities/scope, restrictions or conditions\n\nVerify license validity. Flag expired licenses. Return as JSON.",
  },
];

export default function PromptManagementPage() {
  const { t, currentLanguage } = useLanguage();
  const isThai = currentLanguage.code === "th";
  const [prompts, setPrompts] = useState<PromptTemplate[]>(defaultPrompts);
  const [selectedId, setSelectedId] = useState<string>(defaultPrompts[0]?.id || "");
  const [editingPrompt, setEditingPrompt] = useState("");
  const [saved, setSaved] = useState(false);
  const [filterCat, setFilterCat] = useState("all");

  const selected = prompts.find((p) => p.id === selectedId);

  const categories = [...new Set(prompts.map((p) => (isThai ? p.categoryTh : p.categoryEn)))];
  const filtered = filterCat === "all" ? prompts : prompts.filter((p) => (isThai ? p.categoryTh : p.categoryEn) === filterCat);

  const handleSelect = (id: string) => {
    const p = prompts.find((pr) => pr.id === id);
    if (p) {
      setSelectedId(id);
      setEditingPrompt(p.prompt);
      setSaved(false);
    }
  };

  const handleSave = () => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === selectedId ? { ...p, prompt: editingPrompt, lastEdited: new Date().toISOString() } : p
      )
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const original = defaultPrompts.find((p) => p.id === selectedId);
    if (original) {
      setEditingPrompt(original.prompt);
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === selectedId ? { ...p, prompt: original.prompt, lastEdited: undefined } : p
        )
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-1">{t("prompts.title")}</h2>
        <p className="text-sm text-muted">{t("prompts.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => setFilterCat("all")}
                  className={`text-[11px] px-2 py-1 rounded-sm font-medium transition-colors ${
                    filterCat === "all" ? "bg-navy text-paper" : "bg-line text-muted hover:bg-line-soft"
                  }`}
                >
                  {t("prompts.filterAll")}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`text-[11px] px-2 py-1 rounded-sm font-medium transition-colors ${
                      filterCat === cat ? "bg-navy text-paper" : "bg-line text-muted hover:bg-line-soft"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-sm text-sm transition-colors ${
                    selectedId === p.id
                      ? "bg-navy/10 text-navy font-medium"
                      : "text-slate hover:bg-paper-2"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted uppercase tracking-wider font-mono mr-2">
                        {p.docType}
                      </span>
                      {isThai ? p.labelTh : p.labelEn}
                    </div>
                    {p.lastEdited && (
                      <span className="text-[9px] text-amber flex-shrink-0">{t("prompts.edited")}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h4 className="font-serif font-semibold text-sm mb-3">{t("prompts.promptVariables")}</h4>
            <div className="space-y-2 text-[11px] text-muted">
              <p>{t("prompts.variablesDesc")}</p>
              <div className="space-y-1.5">
                {[
                  { code: "{{doc_type}}", desc: isThai ? "รหัสประเภทเอกสาร (A, B, C...)" : "Document type code (A, B, C...)" },
                  { code: "{{agency}}", desc: isThai ? "ชื่อหน่วยงาน" : "Agency name" },
                  { code: "{{language}}", desc: isThai ? "ภาษาของเอกสาร (th/en)" : "Document language (th/en)" },
                  { code: "{{date}}", desc: isThai ? "วันที่ปัจจุบัน" : "Current date" },
                ].map((v) => (
                  <div key={v.code} className="flex items-baseline gap-2">
                    <code className="bg-navy/10 text-navy px-1 py-0.5 rounded-sm font-mono">{v.code}</code>
                    <span>{v.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-mono text-muted bg-line px-2 py-0.5 rounded-sm uppercase">
                      {selected.docType}
                    </span>
                    <h3 className="font-serif font-semibold text-lg">{isThai ? selected.labelTh : selected.labelEn}</h3>
                  </div>
                  <p className="text-xs text-muted">{isThai ? selected.categoryTh : selected.categoryEn}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="text-xs text-muted hover:text-red transition-colors font-medium"
                  >
                    {t("general.reset")}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">{t("prompts.aiPrompt")}</label>
                <textarea
                  value={editingPrompt}
                  onChange={(e) => setEditingPrompt(e.target.value)}
                  rows={14}
                  className="w-full px-4 py-3 text-sm font-mono border border-line rounded-sm focus:border-navy transition-colors resize-y bg-paper-2 text-slate leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[11px] text-muted">
                  {selected.lastEdited
                    ? `${t("prompts.lastEdited")}: ${new Date(selected.lastEdited).toLocaleString()}`
                    : t("prompts.defaultPrompt")}
                </p>
                <div className="flex items-center gap-3">
                  {saved && (
                    <span className="text-xs text-emerald flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {t("prompts.saved")}
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={editingPrompt === selected.prompt}
                    className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50"
                  >
                    {t("general.save")} {isThai ? "Prompt" : "Prompt"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-muted text-sm">{t("prompts.selectPrompt")}</p>
            </div>
          )}

          <div className="mt-6 card p-6">
            <h3 className="font-serif font-semibold text-lg mb-4">{t("prompts.promptTesting")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">{t("prompts.testInput")}</label>
                <textarea
                  rows={4}
                  placeholder={t("prompts.testInputPlaceholder")}
                  className="w-full px-4 py-3 text-sm border border-line rounded-sm focus:border-navy transition-colors resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">{t("prompts.aiResponse")}</label>
                <div className="bg-paper-2 rounded-sm p-4 text-sm text-slate font-mono min-h-[80px]">
                  <p className="text-muted italic">{t("prompts.aiResponseMsg")}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-primary text-sm px-5 py-2.5">{t("prompts.testWithPipeline")}</button>
                <button className="btn-secondary text-sm px-5 py-2.5">{t("prompts.saveApplyAll")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
