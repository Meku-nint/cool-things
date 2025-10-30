"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => (pathname === href ? "text-black" : "text-zinc-600 hover:text-black");

  return (
    <nav className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-black text-white flex items-center justify-center text-xs font-bold">RSC</div>
          <span className="font-semibold">Royal Smart Computer</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
          <Link href="/sold" className={isActive("/sold")}>Sold</Link>
          <Link href="/orders" className={isActive("/orders")}>Orders</Link>
          <button
            className="text-zinc-600 hover:text-black"
            onClick={() => router.push("/dashboard?upload=1")}
          >
            Upload New Computers
          </button>
        </div>
      </div>
    </nav>
  );
}
