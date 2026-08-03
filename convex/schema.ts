import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    agency: v.string(),
    description: v.string(),
    status: v.union(v.literal("draft"), v.literal("in_progress"), v.literal("completed"), v.literal("rejected")),
    documentCount: v.number(),
    verifiedCount: v.number(),
    rejectedCount: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_status", ["status"]),

  documents: defineTable({
    projectId: v.id("projects"),
    category: v.string(),
    name: v.string(),
    type: v.union(v.literal("scan"), v.literal("pdf"), v.literal("image"), v.literal("text")),
    status: v.union(v.literal("pending"), v.literal("ocr_processing"), v.literal("ocr_done"), v.literal("ai_verifying"), v.literal("verified"), v.literal("flagged"), v.literal("rejected")),
    size: v.number(),
    uploadedAt: v.string(),
    ocrText: v.optional(v.string()),
    score: v.optional(v.number()),
    verificationNotes: v.optional(v.string()),
  }).index("by_project", ["projectId"]).index("by_status", ["status"]),

  documentCategories: defineTable({
    code: v.string(),
    label: v.string(),
    required: v.boolean(),
    count: v.number(),
    verified: v.number(),
    projectId: v.id("projects"),
  }).index("by_project", ["projectId"]),

  knowledgeArticles: defineTable({
    title: v.string(),
    agency: v.string(),
    category: v.string(),
    content: v.string(),
    regulations: v.array(v.string()),
  }).index("by_agency", ["agency"]).index("by_category", ["category"]),

  users: defineTable({
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("officer"), v.literal("reviewer"), v.literal("viewer")),
    agency: v.string(),
    lineId: v.optional(v.string()),
    lastActive: v.string(),
  }).index("by_role", ["role"]).index("by_agency", ["agency"]),
});
