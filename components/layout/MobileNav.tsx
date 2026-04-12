"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  // Lock body scroll while drawer open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const links: { href: string; label: string; icon: string }[] = [
    { href: "/shop", label: t("shop"), icon: "storefront" },
    { href: "/shop/laptops", label: t("laptops"), icon: "laptop_mac" },
    { href: "/shop/graphics-cards", label: t("components"), icon: "memory" },
    { href: "/configurator", label: t("configurator"), icon: "tune" },
    { href: "/support", label: t("support"), icon: "support_agent" },
    { href: "/about", label: t("about"), icon: "info" },
  ];

  return (
    <>
      <button
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 start-0 z-[61] h-[100dvh] w-[86vw] max-w-sm bg-white lg:hidden flex flex-col shadow-2xl rounded-e-3xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        {/* Brand header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-primary to-primary-container text-white rounded-ee-3xl">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 end-4 p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors backdrop-blur"
            aria-label="Close"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Menu
          </div>
          <div className="mt-1 text-xl font-black tracking-tighter">
            ZED INFORMATIQUE
          </div>

          {/* Search */}
          <label className="mt-5 flex items-center gap-3 w-full rounded-full bg-white/15 backdrop-blur ring-1 ring-white/20 px-4 py-3 focus-within:bg-white/25 focus-within:ring-white/40 transition-all cursor-text">
            <Icon
              name="search"
              className="text-white/70 text-[20px] shrink-0 leading-none"
            />
            <input
              type="text"
              placeholder={tc("search")}
              className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none border-none p-0"
            />
          </label>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold uppercase tracking-tight text-on-surface hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon name={l.icon} className="text-[20px]" />
                </span>
                <span className="flex-1">{l.label}</span>
                <Icon
                  name="chevron_right"
                  className="text-on-surface-variant group-hover:text-primary rtl:-scale-x-100 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer CTA */}
        <div className="px-6 py-5 border-t border-outline-variant/60">
          <Link
            href="/configurator"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-[0_8px_20px_-8px_rgba(0,53,208,0.5)] hover:brightness-110 transition-all"
          >
            <Icon name="build" className="text-base" />
            {t("configurator")}
          </Link>
        </div>
      </aside>
    </>
  );
}
