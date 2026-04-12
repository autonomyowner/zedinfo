"use client";

import { usePathname, useRouter } from "@/lib/i18n/routing";
import { locales, type Locale } from "@/lib/i18n/config";
import { useParams } from "next/navigation";

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const current = (params.locale as Locale) ?? "fr";

  const onChange = (next: Locale) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-outline-variant">/</span>}
          <button
            onClick={() => onChange(loc)}
            className={
              loc === current
                ? "text-primary"
                : "text-on-surface-variant hover:text-primary transition-colors"
            }
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  );
}
