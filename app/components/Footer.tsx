import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-white to-slate-200 flex items-center justify-center">
                <span className="font-bold text-slate-900 text-sm">RSC</span>
              </div>
              <h3 className="text-xl font-light bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Royal Smart Computer
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-4">
              Empowering businesses with intelligent sales solutions, comprehensive warranties, 
              and data-driven analytics. Streamlining operations for modern enterprises.
            </p>
            <div className="flex items-center gap-3 text-slate-500">
              <i className="fa-solid fa-envelope text-sm" />
              <span className="text-sm">support@royalsmart.com</span>
            </div>
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-cube text-blue-400 text-xs" />
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/dashboard", label: "Dashboard", icon: "fa-gauge" },
                  { href: "/analytics", label: "Analytics", icon: "fa-chart-column" },
                  { href: "/orders", label: "Orders", icon: "fa-receipt" },
                  { href: "/sold", label: "Sales", icon: "fa-circle-check" }
                ].map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 text-sm"
                    >
                      <i className={`fa-solid ${item.icon} text-xs group-hover:scale-110 transition-transform duration-300`} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-building text-green-400 text-xs" />
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "About Us", icon: "fa-users" },
                  { href: "/contact", label: "Contact", icon: "fa-phone" },
                  { href: "/privacy", label: "Privacy", icon: "fa-shield" },
                  { href: "/terms", label: "Terms", icon: "fa-file-contract" }
                ].map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 text-sm"
                    >
                      <i className={`fa-solid ${item.icon} text-xs group-hover:scale-110 transition-transform duration-300`} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-heart text-rose-400 text-xs" />
              Connect With Us
            </h4>
            <p className="text-slate-400 text-sm mb-4">Follow our journey and stay updated</p>
                        <div className="flex items-center gap-3 mb-6">
              {[
                { href: "https://linkedin.com", icon: "fa-brands fa-linkedin-in", color: "hover:text-blue-400" },
                { href: "https://twitter.com", icon: "fa-brands fa-x-twitter", color: "hover:text-sky-400" },
                { href: "https://facebook.com", icon: "fa-brands fa-facebook-f", color: "hover:text-blue-500" },
                { href: "https://instagram.com", icon: "fa-brands fa-instagram", color: "hover:text-rose-400" },
                { href: "https://tiktok.com", icon: "fa-brands fa-tiktok", color: "hover:text-pink-400" }
              ].map((social, index) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 transition-all duration-300 hover:bg-slate-700/50 hover:scale-110 ${social.color}`}
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl bg-slate-800/50 border border-slate-700 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all duration-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <i className="fa-solid fa-paper-plane text-xs" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-copyright text-xs" />
                <span>{year} Royal Smart Computer. All rights reserved.</span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <span className="text-slate-600">•</span>
                <span>Made with</span>
                <i className="fa-solid fa-heart text-rose-400 text-xs" />
                <span>for the community</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                <i className="fa-solid fa-shield text-xs" />
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                <i className="fa-solid fa-file-contract text-xs" />
                Terms
              </Link>
              <Link href="/sitemap" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                <i className="fa-solid fa-sitemap text-xs" />
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </footer>
  );
}