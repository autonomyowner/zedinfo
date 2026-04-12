import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { Icon } from "@/components/ui/Icon";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CartBadge } from "./CartBadge";
import { MobileNav } from "./MobileNav";
import type { Locale } from "@/lib/i18n/config";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const links = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("products") },
    { href: "/configurator", label: t("buildPc") },
    { href: "/support", label: t("services") },
    { href: "/about", label: t("about") },
    { href: "/support", label: t("contact") },
    { href: "/track", label: t("trackOrder") },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-sm">
      <nav className="flex justify-between items-center h-14 px-4 sm:px-6 lg:px-10 w-full">
        {/* Brand — flush to the edge */}
        <div className="flex items-center gap-3">
          <MobileNav />
          <Link
            href="/"
            aria-label="ZED INFORMATIQUE"
            dir="ltr"
            className="group inline-flex items-center gap-2 leading-none shrink-0"
          >
            <span className="font-display font-black tracking-wider text-on-surface text-lg group-hover:text-primary transition-colors">
              ZED
            </span>
            <span className="hidden sm:inline font-display font-bold tracking-widest text-primary text-[10px]">
              INFORMATIQUE
            </span>
          </Link>
        </div>

        {/* Center nav links */}
        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-slate-700 font-medium hover:text-primary transition-colors text-sm"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="/shop"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors"
            aria-label={tc("search")}
          >
            <Icon name="search" className="text-slate-600 text-[20px]" />
          </Link>
          <CartBadge />
        </div>
      </nav>
    </header>
  );
}
