import { CarrierAdapter, CarrierCredentials, ShipmentData } from "./types";

const BASE = "https://api.ecotrack.dz/api/v1";

function headers(creds: CarrierCredentials) {
  return {
    Authorization: `Bearer ${creds.bearerToken ?? ""}`,
    "Content-Type": "application/json",
  };
}

export function createEcotrackAdapter(creds: CarrierCredentials): CarrierAdapter {
  return {
    async testConnection() {
      const res = await fetch(`${BASE}/wilayas`, { headers: headers(creds) });
      return res.ok;
    },

    async getFees(fromWilaya: number, toWilaya: number) {
      const res = await fetch(`${BASE}/fees?from=${fromWilaya}&to=${toWilaya}`, {
        headers: headers(creds),
      });
      if (!res.ok) throw new Error("Ecotrack fees lookup failed");
      const data = await res.json();
      return data.fee ?? data.home_fee ?? 0;
    },

    async createShipment(order: ShipmentData) {
      const res = await fetch(`${BASE}/shipments`, {
        method: "POST",
        headers: headers(creds),
        body: JSON.stringify({
          reference: order.orderNumber,
          recipient_name: order.customerName,
          recipient_phone: order.phone,
          address: order.address,
          wilaya: order.wilaya,
          commune: order.commune || "",
          amount: order.isCod ? order.totalAmount : 0,
          weight: order.weight || 1,
        }),
      });
      if (!res.ok) throw new Error("Ecotrack shipment creation failed");
      const data = await res.json();
      return { tracking: data.tracking ?? data.barcode ?? "" };
    },

    getTrackingUrl(tracking: string) {
      return `https://ecotrack.dz/tracking/${tracking}`;
    },
  };
}
