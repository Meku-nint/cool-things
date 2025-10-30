"use client";

import Navbar from "../components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Footer from "../components/Footer";

type Computer = {
  id: string;
  name: string;
  price: number;
  negotiable: boolean;
  sold: boolean;
  specs?: string;
  images: string[]; // up to 3
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

const initialItems: Computer[] = [
  {
    id: "1",
    name: "RSC Pro 15",
    price: 1399,
    negotiable: true,
    sold: true,
    images: ["/placeholder-1.png"],
  },
  {
    id: "2",
    name: "RSC Ultra 17",
    price: 2899,
    negotiable: false,
    sold: false,
    images: ["/placeholder-2.png", "/placeholder-3.png"],
  },
  {
    id: "3",
    name: "RSC Air 13",
    price: 799,
    negotiable: true,
    sold: true,
    images: [],
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "sold" | "unsold">("all");
  const [analyticsRange, setAnalyticsRange] = useState<"week" | "3days" | "day">("week");
  const [items, setItems] = useState<Computer[]>(initialItems);
  const [orders, setOrders] = useState<Order[]>([]);

  const [sellId, setSellId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [specs, setSpecs] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);

  // Upload new computer modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uName, setUName] = useState("");
  const [uPrice, setUPrice] = useState<number>(0);
  const [uNegotiable, setUNegotiable] = useState(true);
  const [uSpecs, setUSpecs] = useState("");
  const [uImages, setUImages] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("rsc_token") || sessionStorage.getItem("rsc_token");
    if (!token) router.replace("/login");
    const savedItems = localStorage.getItem("rsc_items");
    const savedOrders = localStorage.getItem("rsc_orders");
    if (savedItems) {
      try { setItems(JSON.parse(savedItems)); } catch {}
    }
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch {}
    }
  }, [router]);

  useEffect(() => {
    localStorage.setItem("rsc_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("rsc_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (searchParams.get("upload") === "1") setUploadOpen(true);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesQuery = i.name.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || (status === "sold" ? i.sold : !i.sold);
      return matchesQuery && matchesStatus;
    });
  }, [items, query, status]);

  const soldCount = items.filter((i) => i.sold).length;
  const unsoldCount = items.length - soldCount;

  function updateItem(id: string, patch: Partial<Computer>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  async function onImagesChange(id: string, files: FileList | null) {
    if (!files) return;
    const limited = Array.from(files).slice(0, 3);
    const previews: string[] = await Promise.all(
      limited.map(
        (f) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(f);
          })
      )
    );
    updateItem(id, { images: previews });
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
    <Navbar/>
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 flex-1 w-full">
        {/* Search + Filter */}
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-zinc-700">
            <i className="fa-solid fa-magnifying-glass" />
            <h2 className="text-base font-semibold">Search and Filter</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <input
              placeholder="Search computers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="col-span-2 rounded border px-3 py-2 outline-none focus:ring shadow-sm"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded border px-3 py-2 shadow-sm"
            >
              <option value="all">All</option>
              <option value="sold">Sold</option>
              <option value="unsold">Unsold</option>
            </select>
            <button className="inline-flex items-center justify-center gap-2 rounded bg-black px-4 py-2 text-white hover:opacity-90 shadow">
              <i className="fa-solid fa-magnifying-glass" /> Search
            </button>
          </div>
        </section>

        {/* Analytics */}
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><i className="fa-solid fa-chart-column text-zinc-700"/> Sales Analytics</h2>
            <div className="flex gap-2">
              {(["week", "3days", "day"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setAnalyticsRange(r)}
                  className={`rounded border px-3 py-1 text-sm shadow-sm ${analyticsRange === r ? "bg-black text-white" : "bg-white"}`}
                >
                  {r === "week" ? "Week" : r === "3days" ? "3 Days" : "Today"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500"><i className="fa-solid fa-circle-check text-green-600"/> Sold Units</div>
              <div className="text-3xl font-bold">{soldCount}</div>
              <div className="text-xs text-zinc-500">in selected range</div>
            </div>
            <div className="rounded border p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-zinc-500"><i className="fa-solid fa-box text-amber-600"/> Unsold Listings</div>
              <div className="text-3xl font-bold">{unsoldCount}</div>
              <div className="text-xs text-zinc-500">currently available</div>
            </div>
          </div>
        </section>

        {/* Editable List */}
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><i className="fa-solid fa-computer text-zinc-700"/> Computers</h3>
          <ul className="divide-y">
            {filtered.map((i) => (
              <li key={i.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between hover:bg-zinc-50/60">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <div className="flex items-start gap-2">
                    <div className="grid grid-cols-3 gap-2">
                      {i.images.length === 0 && (
                        <div className="col-span-3 text-xs text-zinc-500">No images</div>
                      )}
                      {i.images.slice(0, 3).map((src, idx) => (
                        <div key={idx} className="relative h-20 w-28 overflow-hidden rounded border bg-zinc-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={i.name} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="grid gap-1">
                      <label className="text-xs text-zinc-500">Name</label>
                      <input
                        value={i.name}
                        onChange={(e) => updateItem(i.id, { name: e.target.value })}
                        className="rounded border px-3 py-2"
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs text-zinc-500">Price</label>
                      <input
                        type="number"
                        value={i.price}
                        onChange={(e) => updateItem(i.id, { price: Number(e.target.value) || 0 })}
                        className="rounded border px-3 py-2 shadow-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id={`neg-${i.id}`}
                        type="checkbox"
                        checked={i.negotiable}
                        onChange={(e) => updateItem(i.id, { negotiable: e.target.checked })}
                      />
                      <label htmlFor={`neg-${i.id}`} className="text-sm"><i className="fa-regular fa-handshake mr-1"/> Negotiable</label>
                    </div>
                    <div className="grid gap-1 sm:col-span-2">
                      <label className="text-xs text-zinc-500">Specifications</label>
                      <textarea
                        className="min-h-20 rounded border px-3 py-2"
                        value={i.specs || ""}
                        onChange={(e) => updateItem(i.id, { specs: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs text-zinc-500">Update images (max 3)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => onImagesChange(i.id, e.target.files)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${i.sold ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    <i className={`fa-solid ${i.sold ? "fa-circle-check" : "fa-box"}`} /> {i.sold ? "Sold" : "Unsold"}
                  </span>
                  {!i.sold && (
                    <button
                      className="inline-flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-sm text-white hover:opacity-90 shadow"
                      onClick={() => {
                        setSellId(i.id);
                        setBuyerName("");
                        setPhone("");
                        setModel(i.name);
                        setSellPrice(i.price);
                        setSpecs("");
                        setWarrantyMonths(12);
                      }}
                    >
                      <i className="fa-solid fa-receipt"/> Mark as Sold
                    </button>
                  )}
                  <button
                    className="inline-flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm text-white hover:opacity-90 shadow"
                    onClick={() => {
                      if (confirm("Delete this device?")) {
                        setItems((prev) => prev.filter((x) => x.id !== i.id));
                      }
                    }}
                  >
                    <i className="fa-solid fa-trash"/> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        
      </main>

      <Footer />

      {/* Sell Modal */}
      {sellId && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-semibold">Mark as Sold</h4>
              <button className="text-zinc-500 hover:text-black" onClick={() => setSellId(null)}>✕</button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-1">
                <label className="text-xs text-zinc-500">Buyer Name</label>
                <input className="rounded border px-3 py-2" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-zinc-500">Phone Number</label>
                <input className="rounded border px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-zinc-500">Computer Model</label>
                <input className="rounded border px-3 py-2" value={model} onChange={(e) => setModel(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-zinc-500">Price</label>
                <input type="number" className="rounded border px-3 py-2" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value) || 0)} />
              </div>
              <div className="grid gap-1 sm:col-span-2">
                <label className="text-xs text-zinc-500">Specifications</label>
                <textarea className="min-h-20 rounded border px-3 py-2" value={specs} onChange={(e) => setSpecs(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-zinc-500">Warranty Time (months)</label>
                <select className="rounded border px-3 py-2" value={warrantyMonths} onChange={(e) => setWarrantyMonths(Number(e.target.value))}>
                  {[6, 12, 18, 24, 36].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded border px-3 py-2 text-sm" onClick={() => setSellId(null)}>Cancel</button>
              <button
                className="rounded bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                onClick={() => {
                  if (!sellId) return;
                  const item = items.find((x) => x.id === sellId);
                  if (!item) return;
                  updateItem(sellId, { sold: true, price: sellPrice, name: model });
                  // build simple HTML receipt and create blob URL
                  const recHtml = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>Receipt - Royal Smart Computer</title>
                  <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px} h1{font-size:20px;margin:0 0 12px} .row{margin:4px 0} .muted{color:#6b7280} .box{border:1px solid #e5e7eb;padding:12px;border-radius:8px}</style>
                  </head><body>
                  <h1>Receipt</h1>
                  <div class=\"muted\">Royal Smart Computer</div>
                  <div class=\"row\">Date: ${new Date().toLocaleString()}</div>
                  <div class=\"row\">Buyer: ${buyerName} (${phone})</div>
                  <div class=\"row\">Model: ${model}</div>
                  <div class=\"row\">Price: $${sellPrice.toFixed(2)}</div>
                  <div class=\"row\">Warranty: ${warrantyMonths} months</div>
                  ${specs ? `<div class=\"row box\"><strong>Specifications</strong><div class=\"muted\">${specs.replace(/</g, "&lt;")}</div></div>` : ""}
                  <hr style=\"margin:16px 0\"/>
                  <div class=\"muted\">Thank you for your purchase.</div>
                  <script>window.onload=()=>{window.print&&window.print();}</script>
                  </body></html>`;
                  const blob = new Blob([recHtml], { type: "text/html" });
                  const receiptUrl = URL.createObjectURL(blob);
                  setOrders((prev) => [
                    ...prev,
                    {
                      id: `${Date.now()}`,
                      buyerName,
                      phone,
                      model,
                      price: sellPrice,
                      specs,
                      warrantyMonths,
                      receiptUrl,
                    },
                  ]);
                  setSellId(null);
                }}
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Computer Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-lg font-semibold">Upload New Computer</h4>
              <button className="text-zinc-500 hover:text-black" onClick={() => setUploadOpen(false)}>✕</button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-1">
                <label className="text-xs text-zinc-500">Name</label>
                <input className="rounded border px-3 py-2" value={uName} onChange={(e) => setUName(e.target.value)} />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-zinc-500">Price</label>
                <input type="number" className="rounded border px-3 py-2" value={uPrice} onChange={(e) => setUPrice(Number(e.target.value) || 0)} />
              </div>
              <div className="flex items-center gap-2">
                <input id="u-neg" type="checkbox" checked={uNegotiable} onChange={(e) => setUNegotiable(e.target.checked)} />
                <label htmlFor="u-neg" className="text-sm">Negotiable</label>
              </div>
              <div className="grid gap-1 sm:col-span-2">
                <label className="text-xs text-zinc-500">Specifications</label>
                <textarea className="min-h-20 rounded border px-3 py-2" value={uSpecs} onChange={(e) => setUSpecs(e.target.value)} />
              </div>
              <div className="grid gap-1 sm:col-span-2">
                <label className="text-xs text-zinc-500">Images (max 3)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files) return;
                    const limited = Array.from(files).slice(0, 3);
                    const previews: string[] = await Promise.all(
                      limited.map(
                        (f) =>
                          new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(String(reader.result));
                            reader.readAsDataURL(f);
                          })
                      )
                    );
                    setUImages(previews);
                  }}
                />
                {uImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uImages.map((src, idx) => (
                      <div key={idx} className="relative h-20 w-28 overflow-hidden rounded border bg-zinc-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="preview" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded border px-3 py-2 text-sm" onClick={() => setUploadOpen(false)}>Cancel</button>
              <button
                className="rounded bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                onClick={() => {
                  if (!uName) return;
                  const newItem: Computer = {
                    id: `${Date.now()}`,
                    name: uName,
                    price: uPrice,
                    negotiable: uNegotiable,
                    sold: false,
                    specs: uSpecs,
                    images: uImages,
                  };
                  setItems((prev) => [newItem, ...prev]);
                  // reset form
                  setUName("");
                  setUPrice(0);
                  setUNegotiable(true);
                  setUSpecs("");
                  setUImages([]);
                  setUploadOpen(false);
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
