"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) =>
    pathname === href
      ? "text-black"
      : "text-zinc-600 hover:text-black";

  return (
    <nav className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-black text-white flex items-center justify-center text-xs font-bold">RSC</div>
          <span className="font-semibold">Royal Smart Computer</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className={`inline-flex items-center gap-2 ${isActive("/dashboard")}`}>
            <i className="fa-solid fa-gauge" />
            <span>Dashboard</span>
          </Link>
          <Link href="/analytics" className={`inline-flex items-center gap-2 ${isActive("/analytics")}`}>
            <i className="fa-solid fa-chart-column" />
            <span>Analytics</span>
          </Link>
          <Link href="/sold" className={`inline-flex items-center gap-2 ${isActive("/sold")}`}>
            <i className="fa-solid fa-circle-check" />
            <span>Sold</span>
          </Link>
          <Link href="/orders" className={`inline-flex items-center gap-2 ${isActive("/orders")}`}>
            <i className="fa-solid fa-receipt" />
            <span>Orders</span>
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded bg-black px-3 py-2 text-white hover:opacity-90"
            onClick={() => router.push("/dashboard?upload=1")}
          >
            <i className="fa-solid fa-cloud-arrow-up" />
            <span>Upload</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
