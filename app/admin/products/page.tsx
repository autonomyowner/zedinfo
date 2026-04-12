"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDzd } from "@/lib/format";
import { Button } from "@/components/ui/Button";

export default function AdminProductsPage() {
  const products = useQuery(api.products.list, {});
  const remove = useMutation(api.products.remove);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter uppercase">
          Products
        </h1>
        <Link href="/admin/products/new">
          <Button size="sm">+ New Product</Button>
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-950 text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="text-start p-4">Name</th>
              <th className="text-start p-4 hidden md:table-cell">Brand</th>
              <th className="text-end p-4">Price</th>
              <th className="text-end p-4">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p: any) => (
              <tr key={p._id} className="border-b border-outline-variant">
                <td className="p-4 font-bold">{p.nameFr}</td>
                <td className="p-4 hidden md:table-cell text-on-surface-variant">
                  {p.brand}
                </td>
                <td className="p-4 text-end font-bold">{formatDzd(p.priceDzd)}</td>
                <td className="p-4 text-end">
                  <span className={p.stock <= 3 ? "text-error font-bold" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4 text-end">
                  <Link
                    href={`/admin/products/${p._id}`}
                    className="text-primary text-xs font-bold uppercase mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Delete?")) remove({ id: p._id });
                    }}
                    className="text-error text-xs font-bold uppercase"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products?.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant">
            No products yet
          </div>
        )}
      </div>
    </div>
  );
}
