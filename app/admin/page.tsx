"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDzd } from "@/lib/format";

export default function AdminDashboard() {
  const stats = useQuery(api.admin.dashboard, {});

  const cards = stats
    ? [
        { label: "Total Orders", value: stats.totalOrders, icon: "receipt_long" },
        { label: "Pending", value: stats.pending, icon: "hourglass_empty" },
        { label: "Revenue 7d", value: formatDzd(stats.revenue7d), icon: "payments" },
        { label: "Revenue 30d", value: formatDzd(stats.revenue30d), icon: "trending_up" },
        { label: "Products", value: stats.totalProducts, icon: "inventory_2" },
        { label: "Low Stock", value: stats.lowStock, icon: "warning" },
      ]
    : [];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black tracking-tighter uppercase mb-8">
        Dashboard
      </h1>
      {!stats ? (
        <div className="text-on-surface-variant">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-primary text-3xl">
                  {c.icon}
                </span>
              </div>
              <div className="mt-6 text-3xl font-black">{c.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-2">
                {c.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
