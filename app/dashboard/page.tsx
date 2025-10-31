"use client";

import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

type Computer = {
  id: string;
  name: string;
  price: number;
  negotiable: boolean;
  sold: boolean;
  specs?: string;
  images: string[];
  hasUnsavedChanges?: boolean;
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
  const [items, setItems] = useState<Computer[]>(initialItems);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellId, setSellId] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [specs, setSpecs] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uName, setUName] = useState("");
  const [uPrice, setUPrice] = useState<string|number>("");
  const [uNegotiable, setUNegotiable] = useState(true);
  const [uSpecs, setUSpecs] = useState({
    brand: "",
    ram: "",
    storageType: "",
    storageSize: "",
    processor: "",
  });
  const [uImages, setUImages] = useState<string[]>([]);
  const [uFiles, setUFiles] = useState<File[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("rsc_token") || sessionStorage.getItem("rsc_token");
    if (!token) router.replace("/login");

    // Fetch computers from the DB via the API; fall back to localStorage on error
    (async () => {
      try {
        const res = await fetch('/api/computers');
        if (res.ok) {
          const json = await res.json();
          const comps = json.computers || [];
          const mapped: Computer[] = comps.map((c: any) => ({
            id: c.id,
            name: c.name || c.fileName || 'Unnamed',
            price: 0,
            negotiable: false,
            sold: typeof c.count === 'number' ? c.count === 0 : false,
            specs: undefined,
            images: c.fileName ? [`/uploads/${c.fileName}`] : [],
          }));
          setItems(mapped);
          try { localStorage.setItem('rsc_items', JSON.stringify(mapped)); } catch {}
          return;
        }
      } catch (err) {
        // ignore and fallback below
      }

      const savedItems = localStorage.getItem("rsc_items");
      if (savedItems) {
        try { setItems(JSON.parse(savedItems)); } catch {}
      }
    })();

    // Fetch sold orders from DB
    (async () => {
      try {
        const res = await fetch('/api/sold');
        if (res.ok) {
          const json = await res.json();
          const solds = json.solds || [];
          const mappedOrders: Order[] = solds.map((s: any) => ({
            id: s.id,
            buyerName: s.buyerName,
            phone: s.phoneNumber,
            model: s.computerModel,
            price: s.salesPrice || 0,
            specs: s.specifications || '',
            warrantyMonths: parseInt(s.warranty || '', 10) || 0,
          }));
          setOrders(mappedOrders);
          try { localStorage.setItem('rsc_orders', JSON.stringify(mappedOrders)); } catch {}
          return;
        }
      } catch (err) {
        // ignore and fallback below
      }

      const savedOrders = localStorage.getItem("rsc_orders");
      if (savedOrders) {
        try { setOrders(JSON.parse(savedOrders)); } catch {}
      }
    })();
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

  function updateItem(id: string, patch: Partial<Computer>) {
    setItems((prev) => prev.map((i) => 
      i.id === id ? { ...i, ...patch, hasUnsavedChanges: true } : i
    ));
  }

  function saveChanges(id: string) {
    setItems((prev) => prev.map((i) => 
      i.id === id ? { ...i, hasUnsavedChanges: false } : i
    ));
    setEditingItem(null);
  }

  function cancelChanges(id: string, originalItem: Computer) {
    setItems((prev) => prev.map((i) => 
      i.id === id ? { ...originalItem, hasUnsavedChanges: false } : i
    ));
    setEditingItem(null);
  }
  const handleAddDevice = async () => {
    if (!uName) return;

    try {
      const fd = new FormData();
      fd.append('name', uName);
      fd.append('price', String(uPrice));
      fd.append('brand', uSpecs.brand || '');
      fd.append('ram', uSpecs.ram || '');
      fd.append('storageType', uSpecs.storageType || '');
      fd.append('storageSize', uSpecs.storageSize || '');
      fd.append('processor', uSpecs.processor || '');
      fd.append('specifications', [
        uSpecs.brand && `Brand: ${uSpecs.brand}`,
        uSpecs.ram && `RAM: ${uSpecs.ram}`,
        uSpecs.storageType && `Storage Type: ${uSpecs.storageType}`,
        uSpecs.storageSize && `Storage Size: ${uSpecs.storageSize}`,
        uSpecs.processor && `Processor: ${uSpecs.processor}`,
      ].filter(Boolean).join(' | '));

      if (uFiles && uFiles.length > 0) {
        fd.append('file', uFiles[0]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });

      if (res.ok) {
        const json = await res.json();
        const created = json.unsold;
        const mapped: Computer = {
          id: created.id,
          name: created.pcName || uName,
          price: Number(created.price) || Number(uPrice) || 0,
          negotiable: uNegotiable,
          sold: false,
          specs: created.specifications || undefined,
          images: created.imagePath ? [`/uploads/${created.imagePath}`] : uImages,
        };

        setItems((prev: Computer[]) => [mapped, ...prev]);
      } else {
        // fallback to local update if server fails
        const specsString = [
          uSpecs.brand && `Brand: ${uSpecs.brand}`,
          uSpecs.ram && `RAM: ${uSpecs.ram}`,
          uSpecs.storageType && `Storage Type: ${uSpecs.storageType}`,
          uSpecs.storageSize && `Storage Size: ${uSpecs.storageSize}`,
          uSpecs.processor && `Processor: ${uSpecs.processor}`,
        ]
          .filter(Boolean)
          .join(' | ');

        const newItem: Computer = {
          id: `${Date.now()}`,
          name: uName,
          price: Number(uPrice) || 0,
          negotiable: uNegotiable,
          sold: false,
          specs: specsString,
          images: uImages,
        };

        setItems((prev: Computer[]) => [newItem, ...prev]);
      }
    } catch (err) {
      // on error fallback to local-only
      const specsString = [
        uSpecs.brand && `Brand: ${uSpecs.brand}`,
        uSpecs.ram && `RAM: ${uSpecs.ram}`,
        uSpecs.storageType && `Storage Type: ${uSpecs.storageType}`,
        uSpecs.storageSize && `Storage Size: ${uSpecs.storageSize}`,
        uSpecs.processor && `Processor: ${uSpecs.processor}`,
      ]
        .filter(Boolean)
        .join(' | ');

      const newItem: Computer = {
        id: `${Date.now()}`,
        name: uName,
        price: Number(uPrice) || 0,
        negotiable: uNegotiable,
        sold: false,
        specs: specsString,
        images: uImages,
      };

      setItems((prev: Computer[]) => [newItem, ...prev]);
    } finally {
      setUName("");
      setUPrice(0);
      setUNegotiable(true);
      setUSpecs({
        brand: "",
        ram: "",
        storageType: "",
        storageSize: "",
        processor: "",
      });
      setUImages([]);
      setUFiles([]);
      setUploadOpen(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
    setUFiles(limited);
  };

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 text-slate-900 flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm mb-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200">
              <i className="fa-solid fa-magnifying-glass text-slate-600 text-lg" />
            </div>
            <div>
              <h3 className="text-xl font-light text-slate-800">Search & Filter</h3>
              <p className="text-sm text-slate-500">Find devices in your inventory</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            <div className="md:col-span-3">
              <div className="relative">
                <input
                  placeholder="Search by device name or specs..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 pl-11 text-slate-700 transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 outline-none"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <i className="fa-solid fa-magnifying-glass" />
                </div>
              </div>
               <div className="md:col-span-2">
              <button className="w-full h-full inline-flex items-center justify-center gap-3 rounded-xl my-2 bg-slate-900 px-6 py-3 text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105">
                <i className="fa-solid fa-magnifying-glass" />
                Search
              </button>
            </div>
            </div>

            <div className="md:col-span-3">
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "all" | "sold" | "unsold")}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 pr-11 text-slate-700 appearance-none transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 outline-none cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="sold">Sold</option>
                  <option value="unsold">Available</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <i className="fa-solid fa-chevron-down text-sm" />
                </div>
              </div>
            </div>

          
          </div>
        </section>

        {/* Devices Section */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200">
                <i className="fa-solid fa-computer text-slate-600 text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-light text-slate-800">Uploaded Devices</h3>
                <p className="text-sm text-slate-500">{filtered.length} devices found</p>
              </div>
            </div>
            
            <button
              onClick={() => setUploadOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <i className="fa-solid fa-plus" />
              Add Device
            </button>
          </div>

          <div className="space-y-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-slate-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Images Section - Medium Size */}
                  <div className="lg:w-1/3">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Device Images</span>
                      {item.images.length === 0 && (
                        <span className="text-xs text-slate-400">No images</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {item.images.slice(0, 3).map((src, idx) => (
                        <div
                          key={idx}
                          className="relative h-32 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-transform duration-300 group-hover:shadow-sm"
                        >
                          <img
                            src={src}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                      ))}
                      {item.images.length === 0 && (
                        <div className="col-span-2 h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-center">
                          <i className="fa-regular fa-image text-slate-400 text-2xl" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                          <i className="fa-regular fa-tag mr-1" />
                          Device Name
                        </label>
                        <input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, { name: e.target.value })}
                          onFocus={() => setEditingItem(item.id)}
                          className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                          placeholder="Enter device name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                          <i className="fa-regular fa-dollar-sign mr-1" />
                          Price ($)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, { price: Number(e.target.value) || 0 })}
                            onFocus={() => setEditingItem(item.id)}
                            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 pr-12 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="0.00"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <i className="fa-solid fa-money-bill-wave" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:col-span-2">
                        <div className="relative">
                          <input
                            id={`neg-${item.id}`}
                            type="checkbox"
                            checked={item.negotiable}
                            onChange={(e) => {
                              updateItem(item.id, { negotiable: e.target.checked });
                              setEditingItem(item.id);
                            }}
                            className="peer hidden"
                          />
                          <label
                            htmlFor={`neg-${item.id}`}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50/50 px-4 py-3 transition-all duration-200 peer-checked:border-blue-300 peer-checked:bg-blue-50/80 hover:bg-slate-100"
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded-lg border border-slate-400 bg-white transition-all duration-200 peer-checked:bg-blue-500 peer-checked:border-blue-500">
                              <i className="fa-solid fa-check text-xs text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                              <i className="fa-regular fa-handshake mr-2" />
                              Price is negotiable
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                          <i className="fa-regular fa-file-lines mr-1" />
                          Specifications
                        </label>
                        <textarea
                          className="min-h-24 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                          value={item.specs || ""}
                          onChange={(e) => updateItem(item.id, { specs: e.target.value })}
                          onFocus={() => setEditingItem(item.id)}
                          placeholder="Enter device specifications..."
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                          <i className="fa-regular fa-images mr-1" />
                          Update Images (Max 3)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => onImagesChange(item.id, e.target.files)}
                            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                            item.sold
                              ? "bg-green-100/80 text-green-700 shadow-sm"
                              : "bg-amber-100/80 text-amber-700 shadow-sm"
                          }`}
                        >
                          <i className={`fa-solid ${item.sold ? "fa-circle-check" : "fa-box"} text-sm`} />
                          {item.sold ? "Sold" : "Available"}
                        </span>
                        
                        {item.hasUnsavedChanges && editingItem === item.id && (
                          <span className="inline-flex items-center gap-2 rounded-2xl bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            <i className="fa-solid fa-pen-to-square" />
                            Unsaved Changes
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {item.hasUnsavedChanges && editingItem === item.id && (
                          <>
                            <button
                              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-200 hover:scale-105"
                              onClick={() => cancelChanges(item.id, initialItems.find(i => i.id === item.id) || item)}
                            >
                              <i className="fa-solid fa-xmark" />
                              Cancel
                            </button>
                            <button
                              className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-green-600 hover:scale-105"
                              onClick={() => saveChanges(item.id)}
                            >
                              <i className="fa-solid fa-check" />
                              Save Changes
                            </button>
                          </>
                        )}
                        
                        {!item.sold && (
                          <button
                            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105"
                            onClick={() => {
                              setSellId(item.id);
                              setBuyerName("");
                              setPhone("");
                              setModel(item.name);
                              setSellPrice(item.price);
                              setSpecs(item.specs || "");
                              setWarrantyMonths(12);
                            }}
                          >
                            <i className="fa-solid fa-receipt" />
                            Mark as Sold
                          </button>
                        )}
                        <button
                          className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-red-500 to-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this device?")) {
                              setItems((prev) => prev.filter((x) => x.id !== item.id));
                            }
                          }}
                        >
                          <i className="fa-solid fa-trash-can" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Sell Modal */}
      {sellId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-green-100 to-green-200">
                  <i className="fa-solid fa-receipt text-green-600 text-lg" />
                </div>
                <div>
                  <h4 className="text-xl font-light text-slate-800">Mark as Sold</h4>
                  <p className="text-sm text-slate-500">Complete the sale details</p>
                </div>
              </div>
              <button 
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                onClick={() => setSellId(null)}
              >
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Buyer Name</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                  value={buyerName} 
                  onChange={(e) => setBuyerName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Computer Model</label>
                <input 
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                  value={model} 
                  onChange={(e) => setModel(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Sale Price ($)</label>
                <input 
                  type="number" 
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                  value={sellPrice} 
                  onChange={(e) => setSellPrice(Number(e.target.value) || 0)} 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Specifications</label>
                <textarea 
                  className="min-h-24 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                  value={specs} 
                  onChange={(e) => setSpecs(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Warranty (months)</label>
                <select 
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                  value={warrantyMonths} 
                  onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                >
                  {[6, 12, 18, 24, 36].map((m) => (
                    <option key={m} value={m}>{m} months</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-700 font-medium transition-all duration-200 hover:bg-slate-50 hover:scale-105"
                onClick={() => setSellId(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-linear-to-r from-green-500 to-emerald-600 px-6 py-3 text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                onClick={async () => {
                  if (!sellId) return;
                  const item = items.find((x) => x.id === sellId);
                  if (!item) return;

                  // mark locally first for instant UI feedback
                  updateItem(sellId, { sold: true, price: sellPrice, name: model });

                  const recHtml = `<!doctype html><html><head><meta charset="utf-8"/><title>Receipt - Royal Smart Computer</title>
                  <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px} h1{font-size:20px;margin:0 0 12px} .row{margin:4px 0} .muted{color:#6b7280} .box{border:1px solid #e5e7eb;padding:12px;border-radius:8px}</style>
                  </head><body>
                  <h1>Receipt</h1>
                  <div class="muted">Royal Smart Computer</div>
                  <div class="row">Date: ${new Date().toLocaleString()}</div>
                  <div class="row">Buyer: ${buyerName} (${phone})</div>
                  <div class="row">Model: ${model}</div>
                  <div class="row">Price: $${sellPrice.toFixed(2)}</div>
                  <div class="row">Warranty: ${warrantyMonths} months</div>
                  ${specs ? `<div class="row box"><strong>Specifications</strong><div class="muted">${specs.replace(/</g, "&lt;")}</div></div>` : ""}
                  <hr style="margin:16px 0"/>
                  <div class="muted">Thank you for your purchase.</div>
                  <script>window.onload=()=>{window.print&&window.print();}</script>
                  </body></html>`;
                  const blob = new Blob([recHtml], { type: "text/html" });
                  const receiptUrl = URL.createObjectURL(blob);

                  // Try to persist the sale to the DB via API. Fallback to local-only if it fails.
                  try {
                    // include imagePath if available. If image is a data URL, upload it first to get a filename.
                    let itemImage = item.images && item.images.length > 0 ? item.images[0] : '';
                    let imagePath = '';
                    if (itemImage) {
                      if (itemImage.startsWith('/uploads/')) {
                        imagePath = itemImage.replace('/uploads/', '');
                      } else if (itemImage.startsWith('data:')) {
                        // upload data URL to server to persist and get filename
                        try {
                          const blob = await (await fetch(itemImage)).blob();
                          const form = new FormData();
                          // give a default filename
                          const ext = blob.type.split('/')[1] || 'png';
                          const fileName = `sale_image.${ext}`;
                          form.append('file', new File([blob], fileName, { type: blob.type }));
                          const up = await fetch('/api/upload-image', { method: 'POST', body: form });
                          if (up.ok) {
                            const upJson = await up.json();
                            imagePath = upJson.fileName || '';
                          }
                        } catch (e) {
                          console.error('Failed to upload inline image for sold item', e);
                        }
                      }
                    }

                    const payload = {
                      buyerName,
                      phoneNumber: phone,
                      computerModel: model,
                      salesPrice: sellPrice,
                      specifications: specs,
                      warranty: String(warrantyMonths),
                      imagePath,
                    };

                    console.log('Posting sale payload', payload);
                    const res = await fetch('/api/sold', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload),
                    });

                    let json: any = null;
                    try { json = await res.json(); } catch (e) { console.error('Failed to parse /api/sold response', e); }

                    if (res.ok) {
                      const created = json?.sold;
                      console.log('Sold created', created);
                      setOrders((prev) => [
                        ...prev,
                        {
                          id: created.id,
                          buyerName: created.buyerName,
                          phone: created.phoneNumber,
                          model: created.computerModel,
                          price: created.salesPrice || sellPrice,
                          specs: created.specifications || specs,
                          warrantyMonths: parseInt(created.warranty || '', 10) || warrantyMonths,
                          receiptUrl,
                        },
                      ]);
                    } else {
                      // server returned error - fallback to local
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
                    }
                  } catch (err) {
                    // network or other error - fallback to local
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
                  } finally {
                    setSellId(null);
                  }
                }}
              >
                <i className="fa-solid fa-check mr-2" />
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}
      {uploadOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full mt-80 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-fadeIn">
        <div className="mb-6 flex items-left justify-end  top-0 bg-white">
         
          <button
            className="  transition-colors duration-200 hover:cursor-pointer"
            onClick={() => setUploadOpen(false)}
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Device Name
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
              value={uName}
              onChange={(e) => setUName(e.target.value)}
              placeholder="e.g. Dell XPS 13"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Price ($)
            </label>
            <input
              type="number"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 appearance-none focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
              value={uPrice}
onChange={(e) => {
  const value = e.target.value;
  setUPrice(value === "" ? "" : Number(value));
}}              
            />
          </div>
          
          <div className="flex items-center gap-3 md:col-span-2">
            <input
              id="u-neg"
              type="checkbox"
              checked={uNegotiable}
              onChange={(e) => setUNegotiable(e.target.checked)}
              className="rounded border-slate-400 text-blue-600 focus:ring-blue-300"
            />
            <label htmlFor="u-neg" className="text-sm font-medium text-slate-700">
              <i className="fa-regular fa-handshake mr-2" />
              Price is negotiable
            </label>
          </div>
          {[
            { label: "Brand", key: "brand", options: ["Dell", "HP", "Lenovo", "Apple", "Asus"] },
            { label: "RAM", key: "ram", options: ["4GB", "8GB", "16GB", "32GB"] },
            { label: "Storage Type", key: "storageType", options: ["SSD", "HDD", "Hybrid"] },
            { label: "Storage Size", key: "storageSize", options: ["128GB", "256GB", "512GB", "1TB"] },
            { label: "Processor", key: "processor", options: ["Intel i5", "Intel i7", "AMD Ryzen 5", "M1/M2"] },
          ].map((spec) => (
            <div key={spec.key} className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{spec.label}</label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none"
                value={(uSpecs as any)[spec.key]}
                onChange={(e) =>
                  setUSpecs((prev) => ({ ...prev, [spec.key]: e.target.value }))
                }
              >
                <option value="">Select {spec.label}</option>
                {spec.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">
              Images (max 3)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handleImageUpload}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 transition-all duration-200"
            />
            {uImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {uImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative h-24 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 group"
                  >
                    <img
                      src={src}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition">
                      <button
                        className="bg-green-500 p-2 rounded-full text-white"
                        title="Approve"
                      >
                        <i className="fa-solid fa-check" />
                      </button>
                      <button
                        className="bg-red-500 p-2 rounded-full text-white"
                        title="Remove"
                        onClick={() =>
                          setUImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-700 font-medium hover:bg-slate-50 hover:scale-105 transition"
            onClick={() => setUploadOpen(false)}
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-linear-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-medium hover:shadow-lg hover:scale-105 transition"
            onClick={handleAddDevice}
          >
            <i className="fa-solid fa-plus mr-2" />
            Add Device
          </button>
        </div>
      </div>
    </div>
  )}
  <Head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  </Head>
</div>
);
}