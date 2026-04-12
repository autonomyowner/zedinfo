import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { cookies } from "next/headers";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "ZED Admin",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const authed = !!cookieStore.get("admin_session");

  return (
    <html lang="fr" dir="ltr" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=block"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConvexClientProvider>
          {authed ? (
            <div className="min-h-screen flex bg-surface">
              <aside className="w-64 bg-slate-950 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                  <div className="text-lg font-black tracking-tighter">ZED ADMIN</div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {[
                    { href: "/admin", label: "Dashboard", icon: "dashboard" },
                    { href: "/admin/products", label: "Products", icon: "inventory_2" },
                    { href: "/admin/categories", label: "Categories", icon: "category" },
                    { href: "/admin/orders", label: "Orders", icon: "receipt_long" },
                    { href: "/admin/delivery", label: "Delivery", icon: "local_shipping" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm uppercase tracking-widest font-bold"
                    >
                      <span className="material-symbols-outlined text-base">{l.icon}</span>
                      {l.label}
                    </Link>
                  ))}
                </nav>
                <form action="/api/admin/logout" method="POST" className="p-4 border-t border-slate-800">
                  <button className="w-full text-start text-sm text-slate-400 hover:text-white uppercase tracking-widest font-bold">
                    Logout
                  </button>
                </form>
              </aside>
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          ) : (
            <div className="min-h-screen">{children}</div>
          )}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
