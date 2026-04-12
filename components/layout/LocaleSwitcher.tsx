"use client";

import { usePathname, useRouter } from "@/lib/i18n/routing";
import { type Locale } from "@/lib/i18n/config";
import { useParams } from "next/navigation";

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const current = (params.locale as Locale) ?? "fr";

  const other: Locale = current === "fr" ? "ar" : "fr";
  const label = other === "fr" ? "FR" : "AR";

  const onChange = () => {
    router.replace(pathname, { locale: other });
  };

  return (
    <button
      onClick={onChange}
      className="px-3 py-1.5 rounded-lg text-sm font-bold text-primary hover:bg-gray-100 transition-colors"
      title={label}
    >
      {label}
    </button>
  );
}
