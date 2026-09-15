"use client";
import Link from "next/link";
import { useState } from "react";
export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
  Freelancer SaaS
            </h1>
            <p className="text-xs text-text-secondary dark:text-gray-400">
              Smart Invoice Manager
            </p>
          </div>
        </Link>
<button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden bg-white/30 dark:bg-slate-800/50 backdrop-blur-xl border border-white/40 dark:border-white/10 text-text-primary p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            href="/"
            className="text-text-primary hover:text-blue-600 transition font-medium"
          >
            Home
          </Link>

          <Link
            href="/dashboard"
           className="text-text-primary hover:text-blue-600 transition font-medium"
          >
            Dashboard
          </Link>

          <Link
            href="/settings"
            className="text-text-primary hover:text-blue-600 transition font-medium"
          >
            Company
          </Link>

          <Link
            href="/create-invoice"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-md"
          >
            + New Invoice
          </Link>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden w-full border-t border-border bg-surface/95 backdrop-blur-xl px-6 py-5 shadow-lg">
            <div className="flex flex-col gap-3">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-text-primary hover:text-blue-600 font-medium px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition"
              >
                Home
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-text-primary hover:text-blue-600 font-medium px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition"
              >
                Dashboard
              </Link>

              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="text-text-primary hover:text-blue-600 font-medium px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition"
              >
                Company
              </Link>

              <Link
                href="/create-invoice"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white text-center px-5 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
              >
                + New Invoice
              </Link>

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
