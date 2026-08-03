import { mutation } from "./_generated/server";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("projects").first();
    if (existing) return { message: "Already seeded" };

    const prj1 = await ctx.db.insert("projects", {
      name: "โครงการตรวจสอบเอกสารจัดซื้อจัดจ้าง Q3/2569",
      agency: "หน่วยงาน A",
      description: "ตรวจสอบเอกสารประกอบการจัดซื้อจัดจ้างโครงการพัฒนาระบบดิจิทัล",
      status: "in_progress",
      documentCount: 12,
      verifiedCount: 8,
      rejectedCount: 2,
      createdAt: "2026-07-15T09:00:00Z",
      updatedAt: "2026-08-03T08:00:00Z",
    });

    const prj2 = await ctx.db.insert("projects", {
      name: "ตรวจสอบคุณสมบัตินิติบุคคลผู้เสนอราคา",
      agency: "หน่วยงาน B",
      description: "ตรวจสอบเอกสารนิติบุคคลตามระเบียบ DBD สำหรับผู้เสนอราคาโครงการก่อสร้าง",
      status: "completed",
      documentCount: 8,
      verifiedCount: 8,
      rejectedCount: 0,
      createdAt: "2026-06-01T09:00:00Z",
      updatedAt: "2026-07-20T14:00:00Z",
    });

    const prj3 = await ctx.db.insert("projects", {
      name: "ตรวจสอบเอกสารขอรับการส่งเสริม BOI",
      agency: "หน่วยงาน A",
      description: "ตรวจสอบเอกสารประกอบคำขอรับการส่งเสริมการลงทุนตามมาตรา 36",
      status: "draft",
      documentCount: 0,
      verifiedCount: 0,
      rejectedCount: 0,
      createdAt: "2026-08-02T10:00:00Z",
      updatedAt: "2026-08-02T10:00:00Z",
    });

    const prj4 = await ctx.db.insert("projects", {
      name: "ตรวจสอบเอกสารประมูลงานระบบ IT",
      agency: "หน่วยงาน B",
      description: "ตรวจสอบเอกสารประมูลงานพัฒนาระบบสารสนเทศ",
      status: "in_progress",
      documentCount: 20,
      verifiedCount: 14,
      rejectedCount: 3,
      createdAt: "2026-07-25T08:00:00Z",
      updatedAt: "2026-08-02T16:00:00Z",
    });

    const prj5 = await ctx.db.insert("projects", {
      name: "ตรวจสอบเอกสารตรวจรับงานก่อสร้าง",
      agency: "หน่วยงาน A",
      description: "ตรวจสอบเอกสารการตรวจรับงานงวดที่ 3 โครงการก่อสร้างอาคารสำนักงาน",
      status: "completed",
      documentCount: 15,
      verifiedCount: 14,
      rejectedCount: 1,
      createdAt: "2026-05-15T09:00:00Z",
      updatedAt: "2026-06-30T11:00:00Z",
    });

    const categories = [
      { code: "A", label: "เอกสาร A — แบบคำขอ", required: true, count: 3, verified: 3 },
      { code: "AA", label: "เอกสาร AA — หนังสือรับรอง", required: true, count: 2, verified: 1 },
      { code: "AB", label: "เอกสาร AB — รายงานการเงิน", required: true, count: 5, verified: 4 },
      { code: "AC", label: "เอกสาร AC — สัญญาจ้าง", required: false, count: 1, verified: 1 },
      { code: "AD", label: "เอกสาร AD — หนังสือมอบอำนาจ", required: false, count: 2, verified: 0 },
      { code: "BA", label: "เอกสาร BA — ทะเบียนพาณิชย์", required: true, count: 2, verified: 2 },
    ];

    for (const cat of categories) {
      await ctx.db.insert("documentCategories", { ...cat, projectId: prj1 });
    }

    const kbArticles = [
      {
        title: "ระบบวัดชื่อตัวอ้างการจัด ระเบียบการตรวจการคลัง",
        agency: "ทุกหน่วยงาน",
        category: "ระเบียบการคลัง",
        content: "ระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560 กำหนดหลักเกณฑ์การตรวจสอบเอกสารผู้เสนอราคา การตรวจสอบคุณสมบัติ และวิธีการจัดซื้อจัดจ้างแต่ละวิธี",
        regulations: ["พรบ.จัดซื้อจัดจ้างฯ 2560", "ระเบียบกระทรวงการคลังฯ 2560", "มติ ครม. ที่เกี่ยวข้อง"],
      },
      {
        title: "วิธีการค้นหาข้อมูลตามวัตถุประสงค์ของนักวิเคราะห์",
        agency: "หน่วยงาน A",
        category: "วิธีการปฏิบัติงาน",
        content: "คู่มือการสืบค้นและวิเคราะห์ข้อมูลสำหรับการตรวจสอบเอกสาร ประกอบด้วยขั้นตอนการตรวจสอบความถูกต้อง ครบถ้วน และความสอดคล้องของเอกสารตามวัตถุประสงค์ของโครงการ",
        regulations: ["คู่มือนักวิเคราะห์ 2568", "มาตรฐานการตรวจสอบภายใน"],
      },
      {
        title: "วิธีการค้นหาข้อมูลตามระเบียบนิติบุคคล (DBD)",
        agency: "ทุกหน่วยงาน",
        category: "นิติบุคคล",
        content: "แนวทางการตรวจสอบข้อมูลนิติบุคคลผ่านระบบ DBD e-Service การตรวจสอบหนังสือรับรอง ภ.พ.20 งบการเงิน และการตรวจสอบประวัติการถูกเพิกถอน/ระงับการดำเนินกิจการ",
        regulations: ["พรบ.ทะเบียนพาณิชย์ 2499", "พรบ.การบัญชี 2543", "ประกาศ DBD"],
      },
      {
        title: "หลักเกณฑ์ ระเบียบ ตามโครงการหน่วยงาน A",
        agency: "หน่วยงาน A",
        category: "ระเบียบหน่วยงาน",
        content: "ประมวลหลักเกณฑ์และระเบียบปฏิบัติของหน่วยงาน A ว่าด้วยการจัดซื้อจัดจ้าง การบริหารสัญญา การตรวจรับงาน และการเบิกจ่ายเงิน",
        regulations: ["ระเบียบหน่วยงาน A ฉบับที่ 12/2568", "ประกาศหน่วยงาน A ที่ 45/2568"],
      },
      {
        title: "หลักเกณฑ์ ระเบียบ ตามโครงการหน่วยงาน B",
        agency: "หน่วยงาน B",
        category: "ระเบียบหน่วยงาน",
        content: "ประมวลหลักเกณฑ์และระเบียบปฏิบัติของหน่วยงาน B ว่าด้วยการประมูลด้วยวิธีอิเล็กทรอนิกส์ การตรวจสอบคุณสมบัติผู้เสนอราคา และหลักเกณฑ์การพิจารณาผล",
        regulations: ["ระเบียบหน่วยงาน B ฉบับที่ 8/2568", "ประกาศหน่วยงาน B ที่ 23/2568"],
      },
      {
        title: "หลักเกณฑ์ ระเบียบ ตามโครงการหน่วยงาน C",
        agency: "หน่วยงาน C",
        category: "ระเบียบหน่วยงาน",
        content: "ประมวลหลักเกณฑ์และระเบียบปฏิบัติของหน่วยงาน C ว่าด้วยการขอรับการส่งเสริม การรายงานผล และการตรวจสอบภายหลัง",
        regulations: ["ระเบียบหน่วยงาน C ฉบับที่ 5/2568", "ประกาศหน่วยงาน C ที่ 12/2568"],
      },
    ];

    for (const article of kbArticles) {
      await ctx.db.insert("knowledgeArticles", article);
    }

    const mockUsers = [
      { name: "สมชาย ใจดี", role: "admin" as const, agency: "หน่วยงาน A", lineId: "U123456789", lastActive: "2026-08-03T08:00:00Z" },
      { name: "วิภา รักชาติ", role: "officer" as const, agency: "หน่วยงาน A", lineId: "U987654321", lastActive: "2026-08-03T07:45:00Z" },
      { name: "ก้องภพ แสนกล้า", role: "reviewer" as const, agency: "หน่วยงาน A", lineId: "U555555555", lastActive: "2026-08-02T16:30:00Z" },
      { name: "นภา สุขศรี", role: "admin" as const, agency: "หน่วยงาน B", lineId: "U111111111", lastActive: "2026-08-03T07:00:00Z" },
      { name: "พงศ์ มั่นคง", role: "officer" as const, agency: "หน่วยงาน B", lineId: "U222222222", lastActive: "2026-08-02T15:00:00Z" },
      { name: "รัตนา พรหมดี", role: "reviewer" as const, agency: "หน่วยงาน B", lineId: "U333333333", lastActive: "2026-08-02T17:00:00Z" },
      { name: "จิตติ พิทักษ์", role: "viewer" as const, agency: "หน่วยงาน C", lastActive: "2026-08-01T10:00:00Z" },
    ];

    for (const user of mockUsers) {
      await ctx.db.insert("users", user);
    }

    return {
      message: "Seeded successfully",
      projects: [prj1, prj2, prj3, prj4, prj5],
      articles: kbArticles.length,
      users: mockUsers.length,
    };
  },
});
