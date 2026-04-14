"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDzd } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { ar } from "@/lib/admin-i18n";
import type { Id } from "@/convex/_generated/dataModel";

function InlineStock({ productId, value }: { productId: Id<"products">; value: number }) {
  const [editing, setEditing] = useState(false);
  const [stock, setStock] = useState(value);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const update = useMutation(api.products.update);

  useEffect(() => { setStock(value); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const save = async () => {
    setEditing(false);
    if (stock === value) return;
    await update({ id: productId, patch: { stock } });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min={0}
        value={stock}
        onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
        onBlur={save}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setStock(value); setEditing(false); } }}
        className="w-16 text-end rounded-lg border border-primary/40 px-2 py-0.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-sm font-bold transition-all hover:bg-primary/10 cursor-pointer ${value <= 3 ? "text-error" : ""}`}
      title={ar.productsList.stock}
    >
      {value}
      {saved ? (
        <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
      ) : (
        <span className="material-symbols-outlined text-on-surface-variant/50 text-xs">edit</span>
      )}
    </button>
  );
}

export default function AdminProductsPage() {
  const products = useQuery(api.products.list, {});
  const categories = useQuery(api.categories.list);
  const remove = useMutation(api.products.remove);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = products?.filter((p: any) =>
    categoryFilter === "all" ? true : p.categoryId === categoryFilter
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter">
          {ar.productsList.title}
        </h1>
        <Link href="/admin/products/new">
          <Button size="sm">{ar.productsList.newProduct}</Button>
        </Link>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-bold text-on-surface-variant">{ar.productForm.category}:</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-outline-variant/60 bg-white px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">الكل ({products?.length ?? 0})</option>
          {categories?.map((c: any) => {
            const count = products?.filter((p: any) => p.categoryId === c._id).length ?? 0;
            return (
              <option key={c._id} value={c._id}>
                {c.nameFr} ({count})
              </option>
            );
          })}
        </select>
        {categoryFilter !== "all" && (
          <button
            onClick={() => setCategoryFilter("all")}
            className="text-xs text-primary font-bold hover:underline"
          >
            إعادة التعيين
          </button>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[550px]">
          <thead className="bg-slate-950 text-white text-[10px] tracking-widest">
            <tr>
              <th className="text-start p-4">{ar.productsList.image}</th>
              <th className="text-start p-4">{ar.productsList.name}</th>
              <th className="text-start p-4 hidden md:table-cell">{ar.productsList.brand}</th>
              <th className="text-end p-4">{ar.productsList.price}</th>
              <th className="text-end p-4">{ar.productsList.stock}</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((p: any) => (
              <tr key={p._id} className="border-b border-outline-variant hover:bg-surface-container-low">
                <td className="p-4">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-sm">image</span>
                    </div>
                  )}
                </td>
                <td className="p-4 font-bold">{p.nameFr}</td>
                <td className="p-4 hidden md:table-cell text-on-surface-variant">
                  {p.brand}
                </td>
                <td className="p-4 text-end font-bold">{formatDzd(p.priceDzd)}</td>
                <td className="p-4 text-end">
                  <InlineStock productId={p._id} value={p.stock} />
                </td>
                <td className="p-4 text-end">
                  <Link
                    href={`/admin/products/${p._id}`}
                    className="text-primary text-xs font-bold me-4"
                  >
                    {ar.productsList.edit}
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(ar.productsList.deleteConfirm)) remove({ id: p._id });
                    }}
                    className="text-error text-xs font-bold"
                  >
                    {ar.productsList.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered?.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant">
            {ar.productsList.noProducts}
          </div>
        )}
      </div>
    </div>
  );
}
