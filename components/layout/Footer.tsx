import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/config";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tn = await getTranslations({ locale, namespace: "nav" });

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 sm:px-6 lg:px-12 py-10 lg:py-14 w-full max-w-container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="text-lg font-black tracking-tight text-gray-900 mb-2">
              ZED INFORMATIQUE
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">
              {locale === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-1.5 text-[13px]">
              <li><Link href="/" className="text-gray-500 hover:text-primary transition-colors">{tn("home")}</Link></li>
              <li><Link href="/shop" className="text-gray-500 hover:text-primary transition-colors">{tn("products")}</Link></li>
              <li><Link href="/configurator" className="text-gray-500 hover:text-primary transition-colors">{tn("buildPc")}</Link></li>
              <li><Link href="/track-order" className="text-gray-500 hover:text-primary transition-colors">{tn("trackOrder")}</Link></li>
              <li><Link href="/support" className="text-gray-500 hover:text-primary transition-colors">{tn("services")}</Link></li>
              <li><Link href="/about" className="text-gray-500 hover:text-primary transition-colors">{tn("about")}</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-primary transition-colors">{tn("contact")}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">
              {locale === "ar" ? "الفئات" : "Categories"}
            </h3>
            <ul className="space-y-1.5 text-[13px]">
              <li><Link href="/shop/processors" className="text-gray-500 hover:text-primary transition-colors">{locale === "ar" ? "المكونات الأساسية" : "Core Components"}</Link></li>
              <li><Link href="/shop/desktops" className="text-gray-500 hover:text-primary transition-colors">{locale === "ar" ? "أجهزة سطح المكتب" : "Desktops / PCs"}</Link></li>
              <li><Link href="/shop/laptops" className="text-gray-500 hover:text-primary transition-colors">{locale === "ar" ? "الحواسيب المحمولة" : "Laptops / Notebooks"}</Link></li>
              <li><Link href="/shop/printers" className="text-gray-500 hover:text-primary transition-colors">{locale === "ar" ? "الطابعات والماسحات" : "Printers / Scanners & Supplies"}</Link></li>
              <li><Link href="/shop/accessories" className="text-gray-500 hover:text-primary transition-colors">{locale === "ar" ? "الإكسسوارات" : "Accessories"}</Link></li>
              <li><Link href="/shop/networking" className="text-gray-500 hover:text-primary transition-colors">{locale === "ar" ? "الشبكات" : "Networking"}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-3">
              {tn("contact")}
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <a href="tel:+213663287772" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2" dir="ltr">
                  <span className="material-symbols-outlined text-[15px]">call</span>
                  +213 663 28 77 72
                </a>
              </li>
              <li>
                <a href="mailto:zedinformatique2@gmail.com" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] shrink-0">mail</span>
                  <span className="break-all">zedinformatique2@gmail.com</span>
                </a>
              </li>
              <li className="text-gray-500 flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] mt-0.5">location_on</span>
                <span>
                  {locale === "ar"
                    ? "مقابل المجلس الشعبي الولائي، الجلفة 17000"
                    : "Face à l'APW, Djelfa 17000, Algérie"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="px-4 sm:px-6 lg:px-12 py-4 w-full max-w-container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-gray-400 text-xs">
            © 2026 Zed Informatique. {locale === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </span>
          <span className="text-gray-400 text-xs">
            Built by{" "}
            <a
              href="https://sitedz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              SiteDZ
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
