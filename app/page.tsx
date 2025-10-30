"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Item = {
  id: string;
  title: string;
  sold: boolean;
  price: number;
};

const sampleItems: Item[] = [
  { id: "1", title: "RSC Pro 15", sold: true, price: 1399 },
  { id: "2", title: "RSC Ultra 17", sold: false, price: 2899 },
  { id: "3", title: "RSC Air 13", sold: true, price: 799 },
  { id: "4", title: "RSC Studio 14", sold: false, price: 1199 },
];

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "sold" | "unsold">("all");
  const [analyticsRange, setAnalyticsRange] = useState<"week" | "3days" | "day">("week");

  const filtered = useMemo(() => {
    return sampleItems.filter((i) => {
      const matchesQuery = i.title.toLowerCase().includes(query.toLowerCase());
      const matchesStatus =
        status === "all" || (status === "sold" ? i.sold : !i.sold);
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const soldCount = sampleItems.filter((i) => i.sold).length;
  const unsoldCount = sampleItems.length - soldCount;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded bg-black text-white flex items-center justify-center text-xs font-bold">
              RSC
            </div>
            <span className="font-semibold">Royal Smart Computer</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-black">
              Dashboard
            </Link>
            <Link href="#orders" className="hover:text-black">
              Orders
            </Link>
            <Link href="#upload" className="hover:text-black">
              Upload New Computers
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6">
        {/* Search + Filter */}
        <section className="rounded-lg border bg-white p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              placeholder="Search computers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="col-span-2 rounded border px-3 py-2 outline-none focus:ring"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded border px-3 py-2"
            >
              <option value="all">All</option>
              <option value="sold">Sold</option>
              <option value="unsold">Unsold</option>
            </select>
            <button className="rounded bg-black px-4 py-2 text-white hover:opacity-90">
              Search
            </button>
          </div>
        </section>

        {/* Analytics */}
        <section className="rounded-lg border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sales Analytics</h2>
            <div className="flex gap-2">
              {(["week", "3days", "day"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setAnalyticsRange(r)}
                  className={`rounded border px-3 py-1 text-sm ${analyticsRange === r ? "bg-black text-white" : "bg-white"}`}
                >
                  {r === "week" ? "Week" : r === "3days" ? "3 Days" : "Today"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded border p-4">
              <div className="text-sm text-zinc-500">Sold Units</div>
              <div className="text-3xl font-bold">{soldCount}</div>
              <div className="text-xs text-zinc-500">in selected range</div>
            </div>
            <div className="rounded border p-4">
              <div className="text-sm text-zinc-500">Unsold Listings</div>
              <div className="text-3xl font-bold">{unsoldCount}</div>
              <div className="text-xs text-zinc-500">currently available</div>
            </div>
          </div>
        </section>

        {/* List */}
        <section className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 text-lg font-semibold">Computers</h3>
          <ul className="divide-y">
            {filtered.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{i.title}</div>
                  <div className="text-sm text-zinc-500">${i.price.toFixed(2)}</div>
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs ${i.sold ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {i.sold ? "Sold" : "Unsold"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
