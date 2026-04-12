import { query } from "./_generated/server";

export const dashboard = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const products = await ctx.db.query("products").collect();
    const now = Date.now();
    const d7 = now - 7 * 24 * 60 * 60 * 1000;
    const d30 = now - 30 * 24 * 60 * 60 * 1000;
    return {
      totalOrders: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      revenue7d: orders.filter((o) => o.createdAt > d7).reduce((s, o) => s + o.totalDzd, 0),
      revenue30d: orders.filter((o) => o.createdAt > d30).reduce((s, o) => s + o.totalDzd, 0),
      totalProducts: products.length,
      lowStock: products.filter((p) => p.stock <= 3).length,
    };
  },
});
