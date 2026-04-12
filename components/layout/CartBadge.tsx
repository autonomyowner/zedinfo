"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/routing";
import { useCart } from "@/lib/cart-store";
import { Icon } from "@/components/ui/Icon";

export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));

  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      className="p-2 text-slate-600 hover:bg-blue-50 hover:text-primary rounded-xl transition-all active:scale-95 relative"
      aria-label="Cart"
    >
      <Icon name="shopping_cart" />
      <span className="absolute top-0 end-0 bg-primary text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
        {mounted ? count : 0}
      </span>
    </Link>
  );
}
