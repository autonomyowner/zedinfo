"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";

export function SearchDropdown() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("common");

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={t("search")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div className="fixed sm:absolute top-[64px] sm:top-full sm:mt-2 z-50 inset-x-3 sm:inset-x-auto sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 sm:end-0">
            <form onSubmit={handleSubmit} className="w-full">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder") ?? "Search for a product..."}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </form>
          </div>
        </>
      )}
    </div>
  );
}
