"use client";

import { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ar } from "@/lib/admin-i18n";

const ASPECT_RATIOS = [
  { label: "1:1", value: "1:1", desc: "Instagram Post" },
  { label: "4:5", value: "4:5", desc: "Instagram Feed" },
  { label: "16:9", value: "16:9", desc: "Facebook" },
  { label: "9:16", value: "9:16", desc: "Stories" },
];

const PROMO_TYPES = [
  { value: "promotion", label: "Promotion" },
  { value: "special_offer", label: "Offre Spéciale" },
  { value: "flash_sale", label: "Vente Flash" },
  { value: "new_arrival", label: "Nouveau Produit" },
  { value: "best_seller", label: "Best Seller" },
  { value: "limited_stock", label: "Stock Limité" },
  { value: "bundle", label: "Pack / Bundle" },
  { value: "custom", label: "Personnalisé" },
];

const PRICE_STYLES = [
  { value: "normal", label: "Prix normal" },
  { value: "discount_percent", label: "Réduction %" },
  { value: "old_new", label: "Ancien prix → Nouveau prix" },
  { value: "starting_from", label: "À partir de..." },
  { value: "custom", label: "Texte personnalisé" },
];

function buildPrompt({
  product,
  promoType,
  priceStyle,
  discountPercent,
  oldPrice,
  customPriceText,
  customText,
}: {
  product: any;
  promoType: string;
  priceStyle: string;
  discountPercent: string;
  oldPrice: string;
  customPriceText: string;
  customText: string;
}) {
  if (!product) return "";

  const promoLabel: Record<string, string> = {
    promotion: "PROMOTION",
    special_offer: "OFFRE SPÉCIALE",
    flash_sale: "VENTE FLASH ⚡",
    new_arrival: "NOUVEAU",
    best_seller: "BEST SELLER",
    limited_stock: "STOCK LIMITÉ",
    bundle: "PACK SPÉCIAL",
    custom: customText || "PROMOTION",
  };

  let priceSection = "";
  switch (priceStyle) {
    case "normal":
      priceSection = `Display the price "${product.priceDzd} DZD" in large bold text.`;
      break;
    case "discount_percent":
      priceSection = `Show a big "-${discountPercent || "20"}%" badge/circle in red or yellow. Display the new price "${product.priceDzd} DZD" in large bold text.`;
      break;
    case "old_new":
      priceSection = `Show the old price "${oldPrice || product.priceDzd} DZD" crossed out with a strikethrough line, and the new price "${product.priceDzd} DZD" next to it in large bold text, highlighted in yellow or green to emphasize the savings.`;
      break;
    case "starting_from":
      priceSection = `Display "À partir de ${product.priceDzd} DZD" in large bold text.`;
      break;
    case "custom":
      priceSection = `Display this price text: "${customPriceText || product.priceDzd + " DZD"}" in large bold text.`;
      break;
  }

  const extraText = customText && promoType !== "custom" ? `\n- Include this additional text: "${customText}"` : "";

  return `Create a professional promotional banner image with these STRICT requirements:

BACKGROUND:
- Clean WHITE background with a subtle blue grid/line pattern overlay at LOW OPACITY (around 10-15% opacity), creating a modern tech blueprint feel
- The grid lines should be in blue (#0035d0) but very faint/transparent

LOGO:
- In the TOP LEFT corner, place the store logo as a CIRCLE badge — the logo is a blue circle with "ZED" text inside it
- Below or next to the logo, write "ZED INFORMATIQUE" in clean navy blue (#0035d0) bold text

PROMO BADGE:
- Display "${promoLabel[promoType]}" as a large, eye-catching badge/banner — use bold typography, could be in a colored ribbon, sticker, or banner shape
- Use red, yellow/gold, or brand blue for the promo badge depending on urgency

PRODUCT:
- Product name: "${product.nameFr}" in bold dark text, clean modern font
- Brand: "${product.brand}" shown clearly
- The product photo should be LARGE and CENTERED, taking up significant space

PRICE:
- ${priceSection}
- Price should be highly visible and prominent

TYPOGRAPHY:
- Use clean, modern sans-serif fonts throughout
- Strong hierarchy: promo badge > price > product name > brand
- High contrast text — dark text on light areas, white text on dark badges
- Professional kerning and spacing${extraText}

STYLE:
- Modern, clean, professional tech/e-commerce aesthetic
- NOT cluttered — use whitespace effectively
- Social media ready, eye-catching but tasteful
- Sharp, high-quality rendering`;
}

export default function PromotionsPage() {
  const products = useQuery(api.products.list, {});
  const promotions = useQuery(api.promotions.list, {});
  const generateImage = useAction(api.promotionActions.generateImage);
  const postToMeta = useAction(api.promotionActions.postToMeta);
  const removePromotion = useMutation(api.promotions.remove);

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [promoType, setPromoType] = useState("promotion");
  const [priceStyle, setPriceStyle] = useState("normal");
  const [discountPercent, setDiscountPercent] = useState("20");
  const [oldPrice, setOldPrice] = useState("");
  const [customPriceText, setCustomPriceText] = useState("");
  const [customText, setCustomText] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [prompt, setPrompt] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedPromoId, setGeneratedPromoId] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products?.find((p) => p._id === selectedProductId);

  const refreshPrompt = (overrides?: Partial<{
    product: any; promoType: string; priceStyle: string;
    discountPercent: string; oldPrice: string; customPriceText: string; customText: string;
  }>) => {
    const p = overrides?.product ?? selectedProduct;
    if (!p) return;
    setPrompt(buildPrompt({
      product: p,
      promoType: overrides?.promoType ?? promoType,
      priceStyle: overrides?.priceStyle ?? priceStyle,
      discountPercent: overrides?.discountPercent ?? discountPercent,
      oldPrice: overrides?.oldPrice ?? oldPrice,
      customPriceText: overrides?.customPriceText ?? customPriceText,
      customText: overrides?.customText ?? customText,
    }));
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    const product = products?.find((p) => p._id === id);
    if (product) {
      setOldPrice(String(product.priceDzd));
      refreshPrompt({ product });
    }
    setGeneratedImage(null);
    setGeneratedPromoId(null);
  };

  const handleGenerate = async () => {
    if (!selectedProductId || !prompt) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generateImage({
        productId: selectedProductId as Id<"products">,
        prompt,
        aspectRatio,
      });
      setGeneratedImage(result.imageUrl);
      setGeneratedPromoId(result.promoId as string);
    } catch (e: any) {
      setError(e.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handlePost = async (platform: "facebook" | "instagram" | "both") => {
    if (!generatedPromoId || !selectedProduct) return;
    setPosting(true);
    setError(null);
    try {
      const caption = `${selectedProduct.nameFr} - ${selectedProduct.priceDzd} DZD\n${selectedProduct.brand}\n\n🛒 Disponible chez Zed Informatique`;
      await postToMeta({
        promoId: generatedPromoId as Id<"promotions">,
        platform,
        caption,
      });
    } catch (e: any) {
      setError(e.message || "Posting failed");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(ar.promotions.deleteConfirm)) return;
    await removePromotion({ id: id as Id<"promotions"> });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-on-surface">{ar.promotions.title}</h1>
        <p className="text-sm text-on-surface-variant mt-1">{ar.promotions.subtitle}</p>
      </div>

      {/* Generator Card */}
      <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 space-y-5">
        {/* Row 1: Product + Promo Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              {ar.promotions.selectProduct}
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">— {ar.promotions.selectProduct} —</option>
              {products?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nameFr} — {p.brand} — {p.priceDzd} DZD
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Type de promotion
            </label>
            <select
              value={promoType}
              onChange={(e) => { setPromoType(e.target.value); refreshPrompt({ promoType: e.target.value }); }}
              className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {PROMO_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Price Style + related inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Affichage du prix
            </label>
            <select
              value={priceStyle}
              onChange={(e) => { setPriceStyle(e.target.value); refreshPrompt({ priceStyle: e.target.value }); }}
              className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {PRICE_STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {priceStyle === "discount_percent" && (
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                Pourcentage de réduction
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => { setDiscountPercent(e.target.value); refreshPrompt({ discountPercent: e.target.value }); }}
                  className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="20"
                  min="1"
                  max="99"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">%</span>
              </div>
            </div>
          )}

          {priceStyle === "old_new" && (
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                Ancien prix (DZD)
              </label>
              <input
                type="number"
                value={oldPrice}
                onChange={(e) => { setOldPrice(e.target.value); refreshPrompt({ oldPrice: e.target.value }); }}
                className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: 85000"
              />
            </div>
          )}

          {priceStyle === "custom" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-on-surface mb-2">
                Texte du prix personnalisé
              </label>
              <input
                type="text"
                value={customPriceText}
                onChange={(e) => { setCustomPriceText(e.target.value); refreshPrompt({ customPriceText: e.target.value }); }}
                className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: 2 pour 15000 DZD, Gratuit avec achat, etc."
              />
            </div>
          )}
        </div>

        {/* Row 3: Custom text */}
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">
            Texte supplémentaire (optionnel)
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => { setCustomText(e.target.value); refreshPrompt({ customText: e.target.value }); }}
            className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Livraison gratuite, Garantie 2 ans, Offre limitée..."
          />
        </div>

        {/* Aspect Ratio Picker */}
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">
            {ar.promotions.aspectRatio}
          </label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map((r) => (
              <button
                key={r.value}
                onClick={() => setAspectRatio(r.value)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  aspectRatio === r.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-surface-variant text-on-surface-variant hover:bg-primary/10"
                }`}
              >
                {r.label}
                <span className="block text-xs font-normal opacity-70">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt (collapsible) */}
        <div>
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              {showPrompt ? "expand_less" : "expand_more"}
            </span>
            {showPrompt ? "Masquer" : "Voir / modifier"} le prompt IA
          </button>
          {showPrompt && (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={10}
              className="mt-2 w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-xs font-mono resize-y focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!selectedProductId || !prompt || generating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <span className="material-symbols-outlined text-lg">auto_awesome</span>
          {generating ? ar.promotions.generating : ar.promotions.generate}
        </button>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm break-all">
            {error}
          </div>
        )}

        {/* Preview */}
        {generatedImage && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden ring-1 ring-outline-variant/40 bg-gray-100 flex items-center justify-center">
              <img
                src={generatedImage}
                alt="Generated promo"
                className="max-w-full max-h-[500px] object-contain"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={generatedImage}
                download={`promo-${selectedProduct?.slug || "image"}.png`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-variant text-on-surface font-bold text-sm hover:bg-primary/10 transition-all"
              >
                <span className="material-symbols-outlined text-base">download</span>
                {ar.promotions.download}
              </a>
              <button
                onClick={() => handlePost("facebook")}
                disabled={posting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">share</span>
                {posting ? ar.promotions.posting : ar.promotions.postFacebook}
              </button>
              <button
                onClick={() => handlePost("instagram")}
                disabled={posting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">photo_camera</span>
                {posting ? ar.promotions.posting : ar.promotions.postInstagram}
              </button>
              <button
                onClick={() => handlePost("both")}
                disabled={posting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">public</span>
                {posting ? ar.promotions.posting : ar.promotions.postBoth}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-black text-on-surface mb-4">{ar.promotions.history}</h2>
        {!promotions || promotions.length === 0 ? (
          <p className="text-sm text-on-surface-variant">{ar.promotions.noPromotions}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div
                key={promo._id}
                className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 overflow-hidden"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  <img
                    src={promo.imageUrl}
                    alt="Promo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm font-bold text-on-surface truncate">
                    {promo.product?.nameFr || "—"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span>{promo.aspectRatio}</span>
                    <span>·</span>
                    <span>{new Date(promo.createdAt).toLocaleDateString("fr-DZ")}</span>
                    {promo.postedAt && (
                      <>
                        <span>·</span>
                        <span className="text-green-600 font-bold">{ar.promotions.posted}</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={promo.imageUrl}
                      download
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-variant text-on-surface-variant text-xs font-bold hover:bg-primary/10 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      {ar.promotions.download}
                    </a>
                    <button
                      onClick={() => handleDelete(promo._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      {ar.promotions.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
