import type { CartItem } from "./cart-store";
import { formatDzd } from "./format";

export function buildWhatsAppUrl(opts: {
  phoneNumber: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    fullName: string;
    phone: string;
    wilaya: string;
    commune?: string;
    address: string;
    notes?: string;
  };
  locale?: "fr" | "ar";
}): string {
  const { phoneNumber, orderNumber, items, subtotal, shipping, total, customer, locale = "fr" } = opts;
  const lang = locale;
  const lines: string[] = [];

  if (lang === "ar") {
    lines.push(`*طلب جديد — ${orderNumber}*`);
    lines.push("");
    lines.push("*المنتجات:*");
    items.forEach((i) => {
      lines.push(`• ${i.nameAr} × ${i.qty} — ${formatDzd(i.priceDzd * i.qty, "ar")}`);
    });
    lines.push("");
    lines.push(`المجموع الفرعي: ${formatDzd(subtotal, "ar")}`);
    lines.push(`الشحن: ${formatDzd(shipping, "ar")}`);
    lines.push(`*الإجمالي: ${formatDzd(total, "ar")}*`);
    lines.push("");
    lines.push("*العميل:*");
    lines.push(`الاسم: ${customer.fullName}`);
    lines.push(`الهاتف: ${customer.phone}`);
    lines.push(`الولاية: ${customer.wilaya}`);
    if (customer.commune) lines.push(`البلدية: ${customer.commune}`);
    lines.push(`العنوان: ${customer.address}`);
    if (customer.notes) lines.push(`ملاحظات: ${customer.notes}`);
  } else {
    lines.push(`*Nouvelle commande — ${orderNumber}*`);
    lines.push("");
    lines.push("*Produits:*");
    items.forEach((i) => {
      lines.push(`• ${i.nameFr} × ${i.qty} — ${formatDzd(i.priceDzd * i.qty, "fr")}`);
    });
    lines.push("");
    lines.push(`Sous-total: ${formatDzd(subtotal, "fr")}`);
    lines.push(`Livraison: ${formatDzd(shipping, "fr")}`);
    lines.push(`*Total: ${formatDzd(total, "fr")}*`);
    lines.push("");
    lines.push("*Client:*");
    lines.push(`Nom: ${customer.fullName}`);
    lines.push(`Téléphone: ${customer.phone}`);
    lines.push(`Wilaya: ${customer.wilaya}`);
    if (customer.commune) lines.push(`Commune: ${customer.commune}`);
    lines.push(`Adresse: ${customer.address}`);
    if (customer.notes) lines.push(`Notes: ${customer.notes}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phoneNumber}?text=${text}`;
}

export function buildWhatsAppContactUrl(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
