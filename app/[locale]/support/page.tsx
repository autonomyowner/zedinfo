import { getTranslations, setRequestLocale } from "next-intl/server";
import { Icon } from "@/components/ui/Icon";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const revalidate = 3600;

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "support" });

  return (
    <div>
      <section className="bg-slate-950 text-white py-24">
        <div className="container-zed">
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter uppercase">
            {t("title")}
          </h1>
          <p className="text-slate-400 mt-6 max-w-2xl text-lg">{t("subtitle")}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-zed grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-card ring-1 ring-outline-variant/40 p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
            <h2 className="font-black uppercase tracking-tight text-2xl mb-8">
              {t("rmaTitle")}
            </h2>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Nom</Label>
                  <Input />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input type="tel" />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" />
              </div>
              <div>
                <Label>N° de commande</Label>
                <Input />
              </div>
              <div>
                <Label>Description du problème</Label>
                <Textarea rows={5} />
              </div>
              <Button type="submit">Envoyer</Button>
            </form>
          </div>
          <div className="space-y-4">
            {[
              {
                icon: "call",
                label: "+213 663 28 77 72",
                href: "tel:+213663287772",
                ltr: true,
              },
              {
                icon: "mail",
                label: "zedinformatique2@gmail.com",
                href: "mailto:zedinformatique2@gmail.com",
              },
              { icon: "schedule", label: "Dim-Jeu 9h-18h" },
              {
                icon: "location_on",
                label:
                  locale === "ar"
                    ? "الجلفة 17000، الجزائر"
                    : "Djelfa 17000, Algérie",
                href: "https://www.google.com/maps/search/?api=1&query=34.71769,3.328162",
                external: true,
              },
            ].map((c) => {
              const content = (
                <>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon name={c.icon} className="text-[22px]" />
                  </div>
                  <span
                    className="font-bold break-all flex-1 min-w-0"
                    dir={c.ltr ? "ltr" : undefined}
                  >
                    {c.label}
                  </span>
                </>
              );
              const cardClass =
                "group bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-5 flex items-center gap-4 transition-all duration-200";
              return c.href ? (
                <a
                  key={c.icon}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className={`${cardClass} hover:ring-primary/40 hover:shadow-card-hover hover:-translate-y-0.5`}
                >
                  {content}
                </a>
              ) : (
                <div key={c.icon} className={cardClass}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
