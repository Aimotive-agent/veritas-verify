import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    category: v.string(),
    name: v.string(),
    type: v.union(v.literal("scan"), v.literal("pdf"), v.literal("image"), v.literal("text")),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("documents", {
      projectId: args.projectId,
      category: args.category,
      name: args.name,
      type: args.type,
      status: "pending",
      size: args.size,
      uploadedAt: new Date().toISOString(),
    });

    const project = await ctx.db.get(args.projectId);
    if (project) {
      await ctx.db.patch(args.projectId, {
        documentCount: project.documentCount + 1,
        updatedAt: new Date().toISOString(),
      });
    }

    return docId;
  },
});

export const updateVerification = mutation({
  args: {
    id: v.id("documents"),
    status: v.union(v.literal("pending"), v.literal("ocr_processing"), v.literal("ocr_done"), v.literal("ai_verifying"), v.literal("verified"), v.literal("flagged"), v.literal("rejected")),
    score: v.optional(v.number()),
    verificationNotes: v.optional(v.string()),
    ocrText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, any> = { status: args.status };
    if (args.score !== undefined) patch.score = args.score;
    if (args.verificationNotes !== undefined) patch.verificationNotes = args.verificationNotes;
    if (args.ocrText !== undefined) patch.ocrText = args.ocrText;
    await ctx.db.patch(args.id, patch);
  },
});
