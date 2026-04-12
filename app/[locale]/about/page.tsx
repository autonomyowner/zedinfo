import { getTranslations, setRequestLocale } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";

export const revalidate = 3600;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const pillars = [
    { icon: "precision_manufacturing", titleFr: "Précision", titleAr: "الدقة" },
    { icon: "verified", titleFr: "Qualité", titleAr: "الجودة" },
    { icon: "support_agent", titleFr: "Service", titleAr: "الخدمة" },
    { icon: "local_shipping", titleFr: "Livraison", titleAr: "التوصيل" },
  ];

  return (
    <div>
      <section className="bg-slate-950 text-white py-24 lg:py-32">
        <div className="container-zed">
          <span className="text-primary-fixed font-bold uppercase tracking-[0.2em] text-[0.6875rem]">
            ZED INFORMATIQUE
          </span>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter mt-4">
            {t("title")}
          </h1>
          <p className="text-slate-400 mt-6 max-w-2xl text-lg">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-zed">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div
                key={p.icon}
                className="group bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-8 hover:ring-primary/40 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6">
                  <Icon name={p.icon} className="text-[28px]" />
                </div>
                <h3 className="font-black uppercase tracking-tight text-xl">
                  {locale === "ar" ? p.titleAr : p.titleFr}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-surface-container-low">
        <div className="container-zed">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase mb-8">
            {locale === "ar" ? "موقعنا" : "Notre localisation"}
          </h2>
          <div className="bg-white rounded-3xl shadow-card ring-1 ring-outline-variant/40 p-8 lg:p-10 max-w-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <Icon name="location_on" className="text-[28px]" />
            </div>
            <p className="text-on-surface-variant">
              {locale === "ar"
                ? "مقابل المجلس الشعبي الولائي"
                : "Face à l'APW (Assemblée Populaire de Wilaya)"}
              <br />
              {locale === "ar"
                ? "الجلفة 17000، دائرة الجلفة، الجزائر"
                : "Djelfa 17000, Daïra Djelfa, Algérie"}
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=34.71769,3.328162"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_8px_20px_-8px_rgba(0,53,208,0.5)] hover:brightness-110 hover:-translate-y-0.5 transition-all"
            >
              <Icon name="map" className="text-base" />
              {locale === "ar" ? "افتح في الخرائط" : "Ouvrir dans Maps"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
