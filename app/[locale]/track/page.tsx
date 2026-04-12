"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useTranslations, useLocale } from "next-intl";
import { api } from "@/convex/_generated/api";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { formatDzd, localizedName } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";

export default function TrackOrderPage() {
  const t = useTranslations("tracking");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;

  const [orderNumber, setOrderNumber] = useState("");
  const [phoneLast4, setPhoneLast4] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const order = useQuery(
    api.orders.trackOrder,
    submitted && orderNumber && phoneLast4.length === 4
      ? { orderNumber: orderNumber.trim().toUpperCase(), phoneLast4 }
      : "skip"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container-zed py-12 lg:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Icon name="local_shipping" className="text-5xl text-primary mb-3" />
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase">
            {t("title")}
          </h1>
          <p className="text-on-surface-variant mt-2">{t("subtitle")}</p>
        </div>

        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-card ring-1 ring-outline-variant/40 p-6 lg:p-8 mb-8"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1.5">
                {t("orderNumber")}
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  setSubmitted(false);
                }}
                placeholder={t("orderNumberPlaceholder")}
                className="w-full rounded-xl border border-outline-variant px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block mb-1.5">
                {t("phoneLast4")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={phoneLast4}
                onChange={(e) => {
                  setPhoneLast4(e.target.value.replace(/\D/g, "").slice(0, 4));
                  setSubmitted(false);
                }}
                placeholder={t("phoneLast4Placeholder")}
                className="w-full rounded-xl border border-outline-variant px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {t("submit")}
            </Button>
          </div>
        </form>

        {/* Results */}
        {submitted && order === null && (
          <div className="bg-error/10 rounded-2xl ring-1 ring-error/20 p-6 text-center">
            <Icon name="error" className="text-error text-3xl mb-2" />
            <p className="text-sm font-medium text-error">{t("notFound")}</p>
          </div>
        )}

        {submitted && order === undefined && (
          <div className="text-center py-8">{tc("loading")}</div>
        )}

        {order && (
          <div className="space-y-6">
            {/* Order header */}
            <div className="bg-white rounded-3xl shadow-card ring-1 ring-outline-variant/40 p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                    {t("orderNumber")}
                  </div>
                  <div className="font-mono font-black text-xl text-primary">
                    {order.orderNumber}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                    {tc("total")}
                  </div>
                  <div className="font-black text-xl">
                    {formatDzd(order.totalDzd, locale)}
                  </div>
                </div>
              </div>

              {/* Tracking info */}
              {(order.trackingNumber || order.estimatedDelivery) && (
                <div className="bg-surface-container rounded-2xl p-4 mb-6 space-y-2">
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant">{t("trackingNumber")}</span>
                      <span className="font-mono font-bold">{order.trackingNumber}</span>
                    </div>
                  )}
                  {order.carrier && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant">{t("carrier")}</span>
                      <span className="font-bold capitalize">{order.carrier}</span>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-on-surface-variant">{t("estimatedDelivery")}</span>
                      <span className="font-bold">{order.estimatedDelivery}</span>
                    </div>
                  )}
                  {order.carrierTrackingUrl && (
                    <a
                      href={order.carrierTrackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-sm font-bold hover:underline mt-1"
                    >
                      <Icon name="open_in_new" className="text-base" />
                      {t("viewTracking")}
                    </a>
                  )}
                </div>
              )}

              {/* Timeline */}
              <h3 className="font-bold uppercase tracking-widest text-xs mb-4">
                {t("timeline")}
              </h3>
              <TrackingTimeline
                currentStatus={order.status}
                statusHistory={order.statusHistory}
              />
            </div>

            {/* Order items */}
            <div className="bg-white rounded-3xl shadow-card ring-1 ring-outline-variant/40 p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
              <h3 className="font-bold uppercase tracking-widest text-xs mb-4">
                {t("orderDetails")}
              </h3>
              <div className="space-y-3">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between py-2 border-b border-outline-variant last:border-0"
                  >
                    <div>
                      <div className="font-bold text-sm">
                        {localizedName(item, locale)}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {tc("quantity")}: {item.qty}
                      </div>
                    </div>
                    <span className="font-black text-sm">
                      {formatDzd(item.priceDzd * item.qty, locale)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant pt-3 mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{tc("subtotal")}</span>
                  <span className="font-bold">{formatDzd(order.subtotalDzd, locale)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">{tc("shipping")}</span>
                  <span className="font-bold">{formatDzd(order.shippingDzd, locale)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-outline-variant">
                  <span className="font-bold uppercase">{tc("total")}</span>
                  <span className="font-black text-primary text-lg">
                    {formatDzd(order.totalDzd, locale)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
