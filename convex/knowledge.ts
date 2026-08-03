import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("knowledgeArticles").collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("knowledgeArticles").collect();
    const q = args.query.toLowerCase();
    return all.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.regulations.some((r: string) => r.toLowerCase().includes(q)) ||
        a.agency.toLowerCase().includes(q)
    );
  },
});
