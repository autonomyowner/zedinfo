import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function genShareCode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export const saveBuild = mutation({
  args: {
    componentIds: v.array(v.id("products")),
    totalDzd: v.number(),
  },
  handler: async (ctx, args) => {
    const shareCode = genShareCode();
    await ctx.db.insert("savedBuilds", {
      shareCode,
      componentIds: args.componentIds,
      totalDzd: args.totalDzd,
      createdAt: Date.now(),
    });
    return { shareCode };
  },
});

export const byCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const build = await ctx.db
      .query("savedBuilds")
      .withIndex("by_shareCode", (q) => q.eq("shareCode", code))
      .unique();
    if (!build) return null;
    const components = await Promise.all(
      build.componentIds.map((id) => ctx.db.get(id))
    );
    return { ...build, components: components.filter((c) => c !== null) };
  },
});
