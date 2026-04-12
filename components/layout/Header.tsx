import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { Icon } from "@/components/ui/Icon";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { CartBadge } from "./CartBadge";
import { MobileNav } from "./MobileNav";
import type { Locale } from "@/lib/i18n/config";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });

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
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
      <nav className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-10 w-full max-w-container mx-auto">
        {/* Brand */}
        <Link
          href="/"
          aria-label="ZED INFORMATIQUE"
          dir="ltr"
          className="inline-flex items-center gap-2 leading-none shrink-0"
        >
          <span className="font-black tracking-tight text-gray-900 text-lg">
            ZED
          </span>
          <span className="hidden sm:inline font-bold tracking-widest text-primary text-[10px] uppercase">
            Informatique
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-gray-700 hover:text-primary transition-colors text-[14px] font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/shop"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <Icon name="search" className="text-gray-700 text-[22px]" />
          </Link>
          <CartBadge />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
