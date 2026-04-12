"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDzd, formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";

const STATUSES = ["pending", "confirmed", "preparing", "shipping", "delivered", "cancelled"] as const;
const CARRIERS = ["yalidine", "ems", "zr_express", "custom"] as const;

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const order = useQuery(api.orders.byId, { id: id as any });
  const updateStatus = useMutation(api.orders.updateStatus);
  const updateTracking = useMutation(api.orders.updateTracking);

  const [statusNote, setStatusNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [carrierTrackingUrl, setCarrierTrackingUrl] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [trackingInited, setTrackingInited] = useState(false);

  if (!order) return <div className="p-8">Loading...</div>;

  // Initialize tracking fields from order data once
  if (!trackingInited) {
    setTrackingNumber(order.trackingNumber ?? "");
    setCarrier(order.carrier ?? "");
    setCarrierTrackingUrl(order.carrierTrackingUrl ?? "");
    setEstimatedDelivery(order.estimatedDelivery ?? "");
    setTrackingInited(true);
  }

  const phoneE164 = order.customer.phone.replace(/[^0-9+]/g, "");

  const handleStatusChange = async (newStatus: string) => {
    await updateStatus({
      id: order._id,
      status: newStatus as any,
      note: statusNote || undefined,
    });
    setStatusNote("");
  };

  const handleTrackingSave = async () => {
    await updateTracking({
      id: order._id,
      trackingNumber: trackingNumber || undefined,
      carrier: carrier || undefined,
      carrierTrackingUrl: carrierTrackingUrl || undefined,
      estimatedDelivery: estimatedDelivery || undefined,
    });
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">
          Order
        </div>
        <h1 className="text-4xl font-black tracking-tighter font-mono">
          {order.orderNumber}
        </h1>
        <div className="text-xs text-on-surface-variant mt-2">
          {formatDateTime(order.createdAt)}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
            <h2 className="font-black uppercase tracking-tight mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((i: any, idx: number) => (
                <div key={idx} className="flex justify-between py-2 border-b border-outline-variant">
                  <div>
                    <div className="font-bold">{i.nameFr}</div>
                    <div className="text-xs text-on-surface-variant">Qty: {i.qty}</div>
                  </div>
                  <div className="font-black">{formatDzd(i.priceDzd * i.qty)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-bold">{formatDzd(order.subtotalDzd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="font-bold">{formatDzd(order.shippingDzd)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant">
                <span className="font-bold uppercase">Total</span>
                <span className="text-primary font-black text-xl">
                  {formatDzd(order.totalDzd)}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
            <h2 className="font-black uppercase tracking-tight mb-4">Tracking</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                  Carrier
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select carrier</option>
                  {CARRIERS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                  External Tracking URL
                </label>
                <input
                  type="url"
                  value={carrierTrackingUrl}
                  onChange={(e) => setCarrierTrackingUrl(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                  Estimated Delivery
                </label>
                <input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <button
              onClick={handleTrackingSave}
              className="mt-4 rounded-xl bg-primary text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-card hover:brightness-110 hover:-translate-y-0.5 transition-all"
            >
              Save Tracking
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
            <h2 className="font-black uppercase tracking-tight mb-4">Status</h2>
            <div className="mb-4">
              <Badge variant={order.status === "delivered" ? "success" : order.status === "cancelled" ? "error" : "primary"}>
                {order.status}
              </Badge>
            </div>
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <div className="mt-3">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                Status Note (optional)
              </label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add context..."
                className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Status history */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="mt-4 border-t border-outline-variant pt-3">
                <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  History
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[...order.statusHistory].reverse().map((entry: any, idx: number) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center gap-2">
                        <Badge variant="muted" className="text-[8px]">{entry.status}</Badge>
                        <span className="text-on-surface-variant">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {entry.note && (
                        <div className="text-on-surface-variant italic ms-2 mt-0.5">
                          {entry.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
            <h2 className="font-black uppercase tracking-tight mb-4">Customer</h2>
            <dl className="text-sm space-y-2">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Name
                </dt>
                <dd className="font-bold">{order.customer.fullName}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Phone
                </dt>
                <dd className="font-bold">{order.customer.phone}</dd>
              </div>
              {order.customer.email && (
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Email
                  </dt>
                  <dd className="font-bold">{order.customer.email}</dd>
                </div>
              )}
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Wilaya
                </dt>
                <dd className="font-bold">{order.customer.wilaya}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Address
                </dt>
                <dd>{order.customer.address}</dd>
              </div>
              {order.customer.notes && (
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Notes
                  </dt>
                  <dd>{order.customer.notes}</dd>
                </div>
              )}
            </dl>
            <div className="flex gap-2 mt-4">
              <a
                href={`tel:${phoneE164}`}
                className="flex-1 rounded-xl bg-primary text-white py-3 text-center text-xs font-bold uppercase shadow-card hover:brightness-110 hover:-translate-y-0.5 transition-all"
              >
                Call
              </a>
              <a
                href={`https://wa.me/${phoneE164.replace("+", "")}`}
                target="_blank"
                className="flex-1 rounded-xl bg-green-600 text-white py-3 text-center text-xs font-bold uppercase shadow-card hover:brightness-110 hover:-translate-y-0.5 transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
