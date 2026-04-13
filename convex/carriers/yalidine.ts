import { CarrierAdapter, CarrierCredentials, ShipmentData } from "./types";

const BASE = "https://api.yalidine.app/v1";

function headers(creds: CarrierCredentials) {
  return {
    "X-API-ID": creds.apiId ?? "",
    "X-API-TOKEN": creds.apiToken ?? "",
    "Content-Type": "application/json",
  };
}

export function createYalidineAdapter(creds: CarrierCredentials): CarrierAdapter {
  return {
    async testConnection() {
      const res = await fetch(`${BASE}/wilayas/`, { headers: headers(creds) });
      return res.ok;
    },

    async getFees(fromWilaya: number, toWilaya: number) {
      const res = await fetch(
        `${BASE}/deliveryfees/?from_wilaya_id=${fromWilaya}&to_wilaya_id=${toWilaya}`,
        { headers: headers(creds) }
      );
      if (!res.ok) throw new Error("Yalidine fees lookup failed");
      const data = await res.json();
      // Yalidine returns array of fee objects; take desk delivery fee
      if (Array.isArray(data.data) && data.data.length > 0) {
        return data.data[0].desk_fee ?? data.data[0].home_fee ?? 0;
      }
      return 0;
    },

    async createShipment(order: ShipmentData) {
      const body = [{
        order_id: order.orderNumber,
        firstname: order.customerName.split(" ")[0] || order.customerName,
        familyname: order.customerName.split(" ").slice(1).join(" ") || order.customerName,
        contact_phone: order.phone,
        address: order.address,
        to_wilaya_name: order.wilaya,
        to_commune_name: order.commune || "",
        product_list: order.orderNumber,
        price: order.isCod ? order.totalAmount : 0,
        do_insurance: false,
        declared_value: order.totalAmount,
        is_stopdesk: 0,
        has_exchange: 0,
        note: "",
      }];
      const res = await fetch(`${BASE}/parcels/`, {
        method: "POST",
        headers: headers(creds),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Yalidine shipment creation failed");
      const data = await res.json();
      const tracking = data.data?.[0]?.tracking ?? data.tracking ?? "";
      return { tracking, label: data.data?.[0]?.label ?? undefined };
    },

    getTrackingUrl(tracking: string) {
      return `https://yalidine.app/tracking/?tracking=${tracking}`;
    },
  };
}
