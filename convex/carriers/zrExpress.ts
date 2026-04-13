import { CarrierAdapter, CarrierCredentials, ShipmentData } from "./types";

const BASE = "https://procolis.com/api_v1";

function headers(creds: CarrierCredentials) {
  return {
    "Content-Type": "application/json",
  };
}

function authParams(creds: CarrierCredentials) {
  return `id=${encodeURIComponent(creds.apiId ?? "")}&token=${encodeURIComponent(creds.apiToken ?? "")}`;
}

export function createZrExpressAdapter(creds: CarrierCredentials): CarrierAdapter {
  return {
    async testConnection() {
      const res = await fetch(`${BASE}/wilaya?${authParams(creds)}`, { headers: headers(creds) });
      return res.ok;
    },

    async getFees(fromWilaya: number, toWilaya: number) {
      const res = await fetch(`${BASE}/tarification?${authParams(creds)}&wilaya_id=${toWilaya}`, {
        headers: headers(creds),
      });
      if (!res.ok) throw new Error("ZR Express fees lookup failed");
      const data = await res.json();
      return data.livraison_domicile ?? data.livraison_stopdesk ?? 0;
    },

    async createShipment(order: ShipmentData) {
      const res = await fetch(`${BASE}/create_order?${authParams(creds)}`, {
        method: "POST",
        headers: headers(creds),
        body: JSON.stringify({
          nom_client: order.customerName,
          telephone: order.phone,
          adresse: order.address,
          wilaya: order.wilaya,
          commune: order.commune || "",
          montant: order.isCod ? order.totalAmount : 0,
          poids: order.weight || 1,
          reference: order.orderNumber,
          remarque: "",
          type_livraison: "domicile",
        }),
      });
      if (!res.ok) throw new Error("ZR Express shipment creation failed");
      const data = await res.json();
      return { tracking: data.tracking ?? data.code ?? "" };
    },

    getTrackingUrl(tracking: string) {
      return `https://procolis.com/suivi?tracking=${tracking}`;
    },
  };
}
