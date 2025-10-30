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
    const saved = localStorage.getItem("rsc_items");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
  }, []);

  const list = useMemo(() => {
    const base = mode === "sold" ? items.filter((i) => i.sold) : items;
    return base.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
  }, [items, query, mode]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 flex-1 w-full">
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-zinc-700">
            <i className="fa-solid fa-tags" />
            <h1 className="text-lg font-semibold">Sold Devices</h1>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <input
              placeholder="Search sold devices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="col-span-2 rounded border px-3 py-2 outline-none focus:ring shadow-sm"
            />
            <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="rounded border px-3 py-2 shadow-sm">
              <option value="sold">Sold</option>
              <option value="all">All</option>
            </select>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <ul className="divide-y">
            {list.length === 0 ? (
              <li className="py-6 text-center text-sm text-zinc-500">No items match.</li>
            ) : (
              list.map((i) => (
                <li key={i.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                    <div className="grid grid-cols-3 gap-2">
                      {i.images.slice(0, 3).map((src, idx) => (
                        <div key={idx} className="relative h-20 w-28 overflow-hidden rounded border bg-zinc-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={i.name} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="font-medium">{i.name}</div>
                      <div className="text-sm text-zinc-500">${i.price.toFixed(2)}</div>
                      {i.specs && <div className="mt-1 text-xs text-zinc-500">{i.specs}</div>}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                    <i className="fa-solid fa-circle-check" /> Sold
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
