"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UploadComputer from "../components/UploadComputer";
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("rsc_orders");
    if (saved) {
      try { setOrders(JSON.parse(saved)); } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      <Navbar/>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 flex-1">
      <h1 className="mb-4 text-2xl font-semibold">Orders</h1>
      {orders.length === 0 ? (
        <div className="rounded border bg-white p-4 text-sm text-zinc-500">No orders yet.</div>
      ) : (
        <div className="rounded border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50 text-left">
                <UploadComputer/>
                <th className="px-3 py-2">Buyer</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Model</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Warranty</th>
                <th className="px-3 py-2">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="px-3 py-2">{o.buyerName}</td>
                  <td className="px-3 py-2">{o.phone}</td>
                  <td className="px-3 py-2">{o.model}</td>
                  <td className="px-3 py-2">${o.price.toFixed(2)}</td>
                  <td className="px-3 py-2">{o.warrantyMonths} mo</td>
                  <td className="px-3 py-2">
                    {o.receiptUrl ? (
                      <a href={o.receiptUrl} target="_blank" rel="noopener noreferrer" className="rounded border px-2 py-1 hover:bg-zinc-50">View</a>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </main>
      <Footer/>
    </div>
  );
}
