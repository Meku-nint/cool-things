"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";

type Computer = {
  id: string;
  name: string;
  price: number;
  negotiable: boolean;
  sold: boolean;
  specs?: string;
  images: string[];
};

type Order = {
  id: string;
  buyerName: string;
  phone: string;
  model: string;
  price: number;
  specs: string;
  warrantyMonths: number;
  receiptUrl?: string;
};

export default function SalesAnalyticsPage() {
  const [items, setItems] = useState<Computer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [range, setRange] = useState<"week" | "3days" | "day">("week");

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("rsc_items");
      const savedOrders = localStorage.getItem("rsc_orders");
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch {}
  }, []);

  const soldCount = useMemo(() => items.filter((i) => i.sold).length, [items]);
  const unsoldCount = useMemo(() => items.filter((i) => !i.sold).length, [items]);
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0),
    [orders]
  );
  const orderCount = orders.length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 flex-1 w-full">
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <i className="fa-solid fa-chart-column text-zinc-700" /> Sales Analytics
            </h1>
            <div className="flex gap-2">
              {(["week", "3days", "day"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded border px-3 py-1 text-sm shadow-sm ${
                    range === r ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {r === "week" ? "Week" : r === "3days" ? "3 Days" : "Today"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <i className="fa-solid fa-circle-check text-green-600" /> Sold Units
              </div>
              <div className="text-3xl font-bold">{soldCount}</div>
              <div className="text-xs text-zinc-500">in selected range</div>
            </div>
            <div className="rounded border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <i className="fa-solid fa-box text-amber-600" /> Unsold Listings
              </div>
              <div className="text-3xl font-bold">{unsoldCount}</div>
              <div className="text-xs text-zinc-500">currently available</div>
            </div>
            <div className="rounded border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <i className="fa-solid fa-sack-dollar text-emerald-600" /> Total Revenue
              </div>
              <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-zinc-500">sum of recorded orders</div>
            </div>
            <div className="rounded border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <i className="fa-solid fa-receipt text-sky-600" /> Orders
              </div>
              <div className="text-3xl font-bold">{orderCount}</div>
              <div className="text-xs text-zinc-500">total receipts generated</div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-zinc-700">
            <i className="fa-solid fa-chart-line" /> Performance Overview
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded border p-4">
              <div className="text-sm text-zinc-500">Conversion Rate</div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded bg-zinc-100">
                <div className="h-full bg-black" style={{ width: `${items.length ? Math.round((soldCount / items.length) * 100) : 0}%` }} />
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {items.length ? Math.round((soldCount / items.length) * 100) : 0}% of listings sold
              </div>
            </div>
            <div className="rounded border p-4">
              <div className="text-sm text-zinc-500">Average Listing Price</div>
              <div className="mt-2 text-2xl font-semibold">
                ${items.length ? Math.round(items.reduce((s, i) => s + i.price, 0) / items.length).toLocaleString() : 0}
              </div>
              <div className="text-xs text-zinc-500">across all current devices</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
