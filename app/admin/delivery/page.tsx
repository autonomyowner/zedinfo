"use client";

export default function AdminDeliveryPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-widest text-on-surface-variant">
          Settings
        </div>
        <h1 className="text-4xl font-black tracking-tighter">Delivery</h1>
        <p className="text-sm text-on-surface-variant mt-2">
          Manage delivery carriers and API integrations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Yalidine */}
        <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
          <h2 className="font-black uppercase tracking-tight mb-1">Yalidine</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            Algeria&apos;s leading delivery service
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                API Key
              </label>
              <input
                type="password"
                placeholder="Enter API key..."
                disabled
                className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface-container cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                API Token
              </label>
              <input
                type="password"
                placeholder="Enter API token..."
                disabled
                className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface-container cursor-not-allowed"
              />
            </div>
          </div>
          <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-800">
            API integration coming soon. Currently using manual tracking entry on each order.
          </div>
        </div>

        {/* EMS */}
        <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
          <h2 className="font-black uppercase tracking-tight mb-1">EMS / Algérie Poste</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            National postal service express delivery
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                API Key
              </label>
              <input
                type="password"
                placeholder="Enter API key..."
                disabled
                className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface-container cursor-not-allowed"
              />
            </div>
          </div>
          <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-800">
            API integration coming soon. Currently using manual tracking entry on each order.
          </div>
        </div>

        {/* ZR Express */}
        <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
          <h2 className="font-black uppercase tracking-tight mb-1">ZR Express</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            Fast delivery across Algeria
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                API Key
              </label>
              <input
                type="password"
                placeholder="Enter API key..."
                disabled
                className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm bg-surface-container cursor-not-allowed"
              />
            </div>
          </div>
          <div className="mt-4 bg-amber-50 rounded-xl p-3 text-xs text-amber-800">
            API integration coming soon. Currently using manual tracking entry on each order.
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl shadow-card ring-1 ring-outline-variant/40 p-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-container to-primary" />
          <h2 className="font-black uppercase tracking-tight mb-1">How It Works</h2>
          <p className="text-xs text-on-surface-variant mb-4">
            Current workflow for order tracking
          </p>
          <ol className="text-sm space-y-2 list-decimal list-inside text-on-surface-variant">
            <li>Go to <strong>Orders</strong> and select an order</li>
            <li>In the <strong>Tracking</strong> card, select the carrier</li>
            <li>Enter the tracking number from the carrier</li>
            <li>Optionally add the external tracking URL</li>
            <li>Set the estimated delivery date</li>
            <li>Click <strong>Save Tracking</strong></li>
          </ol>
          <p className="text-xs text-on-surface-variant mt-4">
            Customers can track their orders at <strong>/track</strong> using their order number and phone number.
          </p>
        </div>
      </div>
    </div>
  );
}
