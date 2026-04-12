import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    categorySlug: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { categorySlug, featured, limit }) => {
    let products;
    if (categorySlug) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", categorySlug))
        .unique();
      if (!category) return [];
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", category._id))
        .collect();
    } else if (featured !== undefined) {
      products = await ctx.db
        .query("products")
        .withIndex("by_featured", (q) => q.eq("featured", featured))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }
    return limit ? products.slice(0, limit) : products;
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!product) return null;
    const category = await ctx.db.get(product.categoryId);
    return { ...product, category };
  },
});

export const byIds = query({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, { ids }) => {
    const rows = await Promise.all(ids.map((id) => ctx.db.get(id)));
    return rows.filter((r) => r !== null);
  },
});

export const search = query({
  args: { q: v.string() },
  handler: async (ctx, { q }) => {
    if (!q.trim()) return [];
    return await ctx.db
      .query("products")
      .withSearchIndex("search_name", (s) => s.search("nameFr", q))
      .take(20);
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    categoryId: v.id("categories"),
    brand: v.string(),
    nameFr: v.string(),
    nameAr: v.string(),
    descFr: v.string(),
    descAr: v.string(),
    priceDzd: v.number(),
    stock: v.number(),
    images: v.array(v.string()),
    featured: v.boolean(),
    specs: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    patch: v.any(),
  },
  handler: async (ctx, { id, patch }) => {
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
