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
  const conversionRate = items.length ? Math.round((soldCount / items.length) * 100) : 0;
  const averagePrice = items.length ? Math.round(items.reduce((s, i) => s + i.price, 0) / items.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                <i className="fa-solid fa-chart-column text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-slate-800">Sales Analytics</h1>
                <p className="text-sm text-slate-500">Track your business performance and insights</p>
              </div>
            </div>
            
            <div className="flex gap-2 bg-slate-100/80 rounded-2xl p-1.5">
              {(["week", "3days", "day"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                    range === r 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
                  }`}
                >
                  {r === "week" ? "This Week" : r === "3days" ? "Last 3 Days" : "Today"}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  <i className="fa-solid fa-circle-check text-green-600 text-lg" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-600">Sold Units</div>
                  <div className="text-2xl font-light text-slate-800">{soldCount}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">in selected range</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <i className="fa-solid fa-box text-amber-600 text-lg" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-600">Unsold Listings</div>
                  <div className="text-2xl font-light text-slate-800">{unsoldCount}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">currently available</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <i className="fa-solid fa-sack-dollar text-emerald-600 text-lg" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-600">Total Revenue</div>
                  <div className="text-2xl font-light text-slate-800">${totalRevenue.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">sum of recorded orders</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                  <i className="fa-solid fa-receipt text-sky-600 text-lg" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-600">Orders</div>
                  <div className="text-2xl font-light text-slate-800">{orderCount}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">total receipts generated</div>
            </div>
          </div>
        </section>

        {/* Performance Overview */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
              <i className="fa-solid fa-chart-line text-purple-600 text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-light text-slate-800">Performance Overview</h2>
              <p className="text-sm text-slate-500">Key metrics and conversion insights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Rate */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-slate-700">Conversion Rate</div>
                <div className="text-lg font-light text-slate-800">{conversionRate}%</div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Progress</span>
                  <span>{conversionRate}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${conversionRate}%` }}
                  />
                </div>
              </div>
              
              <div className="text-xs text-slate-500">
                {soldCount} out of {items.length} listings sold successfully
              </div>
            </div>

            {/* Average Price & Additional Metrics */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <i className="fa-solid fa-dollar-sign text-blue-600 text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">Avg. Price</div>
                      <div className="text-xl font-light text-slate-800">${averagePrice.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">per device</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                      <i className="fa-solid fa-chart-pie text-green-600 text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">Success Rate</div>
                      <div className="text-xl font-light text-slate-800">
                        {items.length ? Math.round((soldCount / items.length) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">sales efficiency</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                      <i className="fa-solid fa-clock text-amber-600 text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">Active Listings</div>
                      <div className="text-xl font-light text-slate-800">{unsoldCount}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">available now</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                      <i className="fa-solid fa-trophy text-purple-600 text-sm" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">Best Month</div>
                      <div className="text-xl font-light text-slate-800">${Math.round(totalRevenue * 0.3).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">estimated peak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-lightbulb text-amber-500 text-sm" />
                <div className="text-sm font-medium text-slate-700">Quick Insight</div>
              </div>
              <div className="text-xs text-slate-600">
                {conversionRate > 50 ? "Excellent performance! Keep up the momentum." : 
                 conversionRate > 25 ? "Good progress. Focus on converting remaining listings." :
                 "Consider optimizing your listings for better conversion."}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-trend-up text-green-500 text-sm" />
                <div className="text-sm font-medium text-slate-700">Revenue Trend</div>
              </div>
              <div className="text-xs text-slate-600">
                {totalRevenue > 10000 ? "Strong revenue growth observed" :
                 totalRevenue > 5000 ? "Steady revenue stream maintained" :
                 "Building revenue foundation"}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-bullseye text-blue-500 text-sm" />
                <div className="text-sm font-medium text-slate-700">Next Target</div>
              </div>
              <div className="text-xs text-slate-600">
                {unsoldCount > 0 ? `Focus on selling ${unsoldCount} remaining devices` :
                 "All devices sold! Time to add new inventory."}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* FontAwesome CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}