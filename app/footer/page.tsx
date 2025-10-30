"use client";
import Navbar from "../components/Navbar";
export default function FooterPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 flex-1">
        <h1 className="mb-4 text-2xl font-semibold flex items-center gap-2"><i className="fa-solid fa-shield-halved"/> Footer</h1>
        <div className="rounded border bg-white p-4 text-sm text-zinc-600">
          This page demonstrates the global footer content used across the app.
        </div>
      </main>
    </div>
  );
}
