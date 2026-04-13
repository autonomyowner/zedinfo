"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PromoCarousel } from "./PromoCarousel";
import type { Locale } from "@/lib/i18n/config";

export function PromoSection({
  locale,
  eyebrow,
  title,
  subtitle,
  addLabel,
  promoLabel,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  subtitle: string;
  addLabel: string;
  promoLabel: string;
}) {
  const products = useQuery(api.products.listPromo, { limit: 12 });

  if (!products || products.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 lg:py-24 overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-zed relative z-10">
        <div className="mb-10 lg:mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-fixed/70 mb-2">
            {eyebrow}
          </span>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase text-white mb-3">
            {title}
          </h2>
          <p className="text-white/60 text-sm sm:text-base max-w-xl">
            {subtitle}
          </p>
        </div>

        <PromoCarousel
          products={products}
          locale={locale}
          addLabel={addLabel}
          promoLabel={promoLabel}
        />
      </div>
    </section>
  );
}
