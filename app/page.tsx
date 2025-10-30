"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!email || !password) throw new Error("Email and password are required");
      const token = "demo-token";
      if (remember) localStorage.setItem("rsc_token", token);
      else sessionStorage.setItem("rsc_token", token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">

          <h1 className="text-3xl font-light text-slate-800 tracking-tight">Royal Smart Computer</h1>
          <p className="text-slate-500 mt-2 font-light">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-sm border border-slate-200/60">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-normal text-slate-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-normal text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none transition-all duration-200"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-400 text-slate-700 focus:ring-slate-300"
                />
                Remember me
              </label>
              <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors duration-200 font-light">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3.5 text-white text-sm font-medium shadow-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
       
      </div>
    </div>
  );
}