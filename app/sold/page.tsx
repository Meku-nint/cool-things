"use client";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Computer = {
  id: string;
  name: string;
  price: number;
  negotiable: boolean;
  sold: boolean;
  specs?: string;
  images: string[];
};

export default function SoldPage() {
  const [items, setItems] = useState<Computer[]>([]);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"sold" | "all">("sold");

  useEffect(() => {
    // Try to load sold records from the server (Prisma-backed /api/sold)
    (async () => {
      try {
        const res = await fetch('/api/sold');
        if (res.ok) {
          const json = await res.json();
          const solds = json.solds || [];
          const mapped = solds.map((s: any) => ({
            id: s.id,
            name: s.computerModel || s.buyerName || 'Sold item',
            price: typeof s.salesPrice === 'number' ? s.salesPrice : parseInt(s.salesPrice, 10) || 0,
            negotiable: false,
            sold: true,
            specs: s.specifications || '',
            images: s.imagePath ? [`/uploads/${s.imagePath}`] : [],
          }));
          setItems(mapped);
          try { localStorage.setItem('rsc_items', JSON.stringify(mapped)); } catch {}
          return;
        }
      } catch (err) {
        // ignore and fallback to localStorage below
      }

      const saved = localStorage.getItem("rsc_items");
      if (saved) {
        try { setItems(JSON.parse(saved)); } catch {}
      }
    })();
  }, []);

  const list = useMemo(() => {
    const base = mode === "sold" ? items.filter((i) => i.sold) : items;
    return base.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
  }, [items, query, mode]);

  const soldCount = useMemo(() => items.filter((i) => i.sold).length, [items]);
  const totalRevenue = useMemo(() => 
    items.filter(i => i.sold).reduce((sum, i) => sum + i.price, 0), 
    [items]
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 text-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-100 to-green-200">
                <i className="fa-solid fa-circle-check text-green-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-slate-800">Sold Devices</h1>
                <p className="text-sm text-slate-500">Track your successful sales and inventory</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-lg font-light text-slate-800">{soldCount}</div>
                <div className="text-xs text-slate-500">Sold Items</div>
              </div>
              <div className="w-px bg-slate-300"></div>
              <div className="text-center">
                <div className="text-lg font-light text-slate-800">${totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Total Revenue</div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            <div className="md:col-span-4">
              <div className="relative">
                <input
                  placeholder="Search devices by name or specifications..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 pl-11 text-slate-700 transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 outline-none"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <i className="fa-solid fa-magnifying-glass" />
                </div>
              </div>
            </div>

          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
          {list.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <i className="fa-regular fa-folder-open text-slate-400 text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-light text-slate-700 mb-2">No devices found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {query ? "No devices match your search criteria." : 
                 mode === "sold" ? "No sold devices in your inventory yet." : 
                 "No devices in your inventory."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {list.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:border-slate-300"
                >
                  {/* Images */}
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-2">
                      {item.images.slice(0, 3).map((src, idx) => (
                        <div
                          key={idx}
                          className="relative h-24 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-transform duration-300 group-hover:shadow-sm"
                        >
                          <img
                            src={src}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                      ))}
                      {item.images.length === 0 && (
                        <div className="col-span-3 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-center">
                          <i className="fa-regular fa-image text-slate-400 text-xl" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Device Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-slate-800 text-lg mb-1">{item.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="font-semibold text-green-600">${item.price.toLocaleString()}</span>
                          {item.negotiable && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
                              <i className="fa-regular fa-handshake" />
                              Negotiable
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-medium ${
                        item.sold
                          ? "bg-green-100/80 text-green-700"
                          : "bg-amber-100/80 text-amber-700"
                      }`}>
                        <i className={`fa-solid ${item.sold ? "fa-circle-check" : "fa-box"}`} />
                        {item.sold ? "Sold" : "Available"}
                      </span>
                    </div>

                    {item.specs && (
                      <div className="pt-3 border-t border-slate-100">
                        <div className="text-xs font-medium text-slate-600 mb-2">SPECIFICATIONS</div>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {item.specs}
                        </p>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <i className="fa-regular fa-calendar" />
                          Added recently
                        </span>
                      </div>
                      
                      <button className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all duration-200 hover:bg-slate-200 hover:scale-105">
                        <i className="fa-regular fa-eye" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Footer */}
          {list.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-4">
                  <span>Showing {list.length} of {mode === 'sold' ? soldCount : items.length} devices</span>
                  {query && (
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-magnifying-glass text-xs" />
                      Filtered by "{query}"
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Sold: {soldCount}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    Available: {items.length - soldCount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* FontAwesome CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}