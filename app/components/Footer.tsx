import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-black border-t border-zinc-800 text-zinc-200">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Brand / About */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold">Royal Smart Computer</h3>
            <p className="mt-2 text-sm text-zinc-300 max-w-md">Smart sales, warranties, and analytics — helpful tools and services for small businesses and hobbyists.</p>
            <p className="mt-4 text-xs text-zinc-400">© {year} Royal Smart Computer. All rights reserved.</p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
                <li><Link href="/order" className="hover:underline">Orders</Link></li>
                <li><Link href="/login" className="hover:underline">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li><Link href="/about" className="hover:underline">About</Link></li>
                <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col items-start">
            <h4 className="text-sm font-medium">Follow us</h4>
            <div className="mt-3 flex items-center gap-4">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-400 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v13H0V8zm7.5 0h4.8v1.78h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V21h-5v-6.04c0-1.44-.03-3.29-2-3.29-2 0-2.31 1.56-2.31 3.18V21h-5V8z" />
                </svg>
              </a>

              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-pink-400 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 2v7.2a4 4 0 1 0 4 4V6h4V2h-8zM8 20a4 4 0 1 1 0-8v8z" />
                </svg>
              </a>

              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2V12h2.2V9.7c0-2.2 1.3-3.5 3.3-3.5.96 0 1.97.17 1.97.17v2.2h-1.12c-1.1 0-1.44.68-1.44 1.38V12h2.45l-.39 2.9h-2.06v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>

              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-400 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M23 4.6c-.8.35-1.6.6-2.5.71.9-.55 1.6-1.43 1.9-2.46-.85.5-1.8.86-2.8 1.05C18.6 3 17.5 2.5 16.3 2.5c-2.3 0-4.1 1.87-4.1 4.17 0 .33.04.65.11.96-3.4-.17-6.4-1.8-8.4-4.28-.35.6-.56 1.28-.56 2.02 0 1.4.7 2.63 1.76 3.36-.65-.02-1.26-.2-1.8-.5v.05c0 1.97 1.4 3.62 3.28 4-.34.1-.7.15-1.07.15-.26 0-.5-.03-.74-.07.5 1.56 1.94 2.7 3.64 2.74C6 19.4 4.2 20 2.3 20c-.36 0-.71-.02-1.06-.06 2 1.28 4.38 2.02 6.94 2.02 8.32 0 12.87-6.9 12.87-12.88v-.59C21.6 6.2 22.4 5.45 23 4.6z" />
                </svg>
              </a>

              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-rose-400 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2A4.8 4.8 0 1 0 16.8 13 4.8 4.8 0 0 0 12 8.2zm6.2-3.3a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 border-t border-zinc-800 pt-6 text-sm text-zinc-400 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-3 md:mb-0">Made with care — support@royalsmart.example</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span className="text-zinc-500">•</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
