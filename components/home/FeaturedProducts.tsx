"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Locale } from "@/lib/i18n/config";

export function FeaturedProducts({
  locale,
  title,
  subtitle,
  inStockLabel,
  addLabel,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  inStockLabel: string;
  addLabel: string;
}) {
  const products = useQuery(api.products.list, { featured: true, limit: 8 });

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-surface-container-low py-16 lg:py-24">
      <div className="container-zed">
        <div className="text-center mb-10 lg:mb-14">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase mb-3">
            {title}
          </h2>
          <p className="text-on-surface-variant text-sm sm:text-base max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              locale={locale}
              label={inStockLabel}
              addLabel={addLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
