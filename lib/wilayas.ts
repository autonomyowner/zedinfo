import { WILAYAS_BILINGUAL, getCommunesForWilaya } from "./wilayas-communes";
export { WILAYAS_BILINGUAL, getCommunesForWilaya };
export type { Commune } from "./wilayas-communes";

// 69 wilayas of Algeria (French names, kept for backwards compat)
export const WILAYAS = WILAYAS_BILINGUAL.map((w) => w.fr);

export function getShippingCost(_wilaya: string): number {
  // Flat rate for now; admin can replace later
  return 800;
}

/** Get 1-based wilaya number from French name (index in WILAYAS_BILINGUAL + 1) */
export function getWilayaNumber(wilayaFr: string): number {
  const idx = WILAYAS_BILINGUAL.findIndex((w) => w.fr === wilayaFr);
  return idx >= 0 ? idx + 1 : 0;
}
