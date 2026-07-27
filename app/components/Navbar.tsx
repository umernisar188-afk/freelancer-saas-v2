"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            F
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Freelancer SaaS
            </h1>

            <p className="text-xs text-gray-500">
              Smart Invoice Manager
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">

          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Dashboard
          </Link>

          <Link
            href="/settings"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
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
      </div>
    </nav>
  );
}