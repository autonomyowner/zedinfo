"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/routing";
import { useCart } from "@/lib/cart-store";

export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));

  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
      aria-label="Cart"
    >
      <div className="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
      </div>
      {mounted && count > 0 && (
        <span className="absolute -top-0.5 -end-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
          {count}
        </span>
      )}
    </Link>
  );
}
