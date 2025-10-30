"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const isActive = (href: string) =>
    pathname === href ? "text-slate-900 font-medium bg-slate-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50";

  const handleLogout = () => {
    localStorage.removeItem("rsc_token");
    sessionStorage.removeItem("rsc_token");
    router.push("/");
  };

  const menuItems = [
    { href: "/dashboard", icon: "fa-gauge", label: "Dashboard" },
    { href: "/analytics", icon: "fa-chart-column", label: "Analytics" },
    { href: "/sold", icon: "fa-circle-check", label: "Sold" },
    { href: "/orders", icon: "fa-receipt", label: "Orders" },
  ];

  return (
    <nav className={`sticky top-0 z-50 border-b p-2 transition-all duration-500 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-xl shadow-lg border-slate-200/80" 
        : "bg-white/80 backdrop-blur-lg shadow-sm border-slate-200"
    }`}>
      <div className="mx-auto w-full  flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-black  text-white flex items-center justify-center font-semibold text-sm shadow-sm transition-transform duration-300 hover:scale-105">
            <i className="fa-solid fa-desktop text-xs"></i>
          </div>
          <span className="font-light text-xl text-slate-900 tracking-tight transition-all duration-300">
            Royal Smart Computer
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${isActive(item.href)}`}
            >
              <i className={`fa-solid ${item.icon} w-4 text-center`} />
              {item.label}
            </Link>
          ))}
                    <button
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5  text-sm transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
            onClick={() => router.push("/dashboard?upload=1")}
          >
            <i className="fa-solid fa-cloud-arrow-up" />
            Upload
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-red-600 text-sm hover:bg-red-100 transition-all duration-300 transform hover:scale-105"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket" />
            Logout
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button
            ref={hamburgerRef}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 transform hover:scale-110"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fa-solid fa-bars text-lg transition-transform duration-300 ${isOpen ? 'rotate-90 scale-110' : 'rotate-0'}`} />
          </button>
        </div>
      </div>
      <div
        ref={mobileMenuRef}
        className={`md:hidden overflow-hidden transition-all duration-500 ease-out bg-white/95 backdrop-blur-xl border-t border-slate-200 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {menuItems.map((item, index) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 transform ${
                isOpen 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-4 opacity-0'
              } ${isActive(item.href)}`}
              style={{ transitionDelay: isOpen ? `${index * 100}ms` : '0ms' }}
              onClick={() => setIsOpen(false)}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
                    <button
            className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl  transition-all duration-500 transform hover:cursor-pointer hover:bg-gray-100 ${
              isOpen 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-4 opacity-0'
            }`}
            style={{ transitionDelay: isOpen ? `${menuItems.length * 100}ms` : '0ms' }}
            onClick={() => {
              router.push("/dashboard?upload=1");
              setIsOpen(false);
            }}
          >
            <i className="fa-solid fa-cloud-arrow-up w-5 text-center" />
            <span className="font-medium">Upload</span>
          </button>
                    <button
            className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-500 transform ${
              isOpen 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-4 opacity-0'
            }`}
            style={{ transitionDelay: isOpen ? `${(menuItems.length + 1) * 100}ms` : '0ms' }}
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </nav>
  );
}