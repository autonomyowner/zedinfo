import { WILAYAS_BILINGUAL, getCommunesForWilaya } from "./wilayas-communes";
export { WILAYAS_BILINGUAL, getCommunesForWilaya };
export type { Commune } from "./wilayas-communes";

// 69 wilayas of Algeria (French names, kept for backwards compat)
export const WILAYAS = WILAYAS_BILINGUAL.map((w) => w.fr);

export function getShippingCost(_wilaya: string): number {
  // Flat rate for now; admin can replace later
  return 800;
}
