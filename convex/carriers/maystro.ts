import { CarrierAdapter, CarrierCredentials, ShipmentData } from "./types";

const BASE = "https://api.maystro-delivery.com/api/v1";

function headers(creds: CarrierCredentials) {
  return {
    Authorization: `Bearer ${creds.bearerToken ?? ""}`,
    "Content-Type": "application/json",
  };
}

export function createMaystroAdapter(creds: CarrierCredentials): CarrierAdapter {
  return {
    async testConnection() {
      const res = await fetch(`${BASE}/wilayas/`, { headers: headers(creds) });
      return res.ok;
    },

    async getFees(fromWilaya: number, toWilaya: number) {
      const res = await fetch(`${BASE}/deliveryfee/?destination=${toWilaya}`, {
        headers: headers(creds),
      });
      if (!res.ok) throw new Error("Maystro fees lookup failed");
      const data = await res.json();
      return data.home_fee ?? data.desk_fee ?? 0;
    },

    async createShipment(order: ShipmentData) {
      const res = await fetch(`${BASE}/parcels/`, {
        method: "POST",
        headers: headers(creds),
        body: JSON.stringify({
          reference: order.orderNumber,
          customer_name: order.customerName,
          customer_phone: order.phone,
          address: order.address,
          wilaya: order.wilaya,
          commune: order.commune || "",
          price: order.isCod ? order.totalAmount : 0,
          weight: order.weight || 1,
          type: "delivery",
        }),
      });
      if (!res.ok) throw new Error("Maystro shipment creation failed");
      const data = await res.json();
      return { tracking: data.tracking ?? data.code ?? "" };
    },

    getTrackingUrl(tracking: string) {
      return `https://maystro-delivery.com/tracking/${tracking}`;
    },
  };
}
