import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 dark:from-slate-950 dark:via-blue-950 dark:to-emerald-950 flex items-center justify-center p-6 sm:p-10 transition-colors duration-300">

      {/* Background Glow */}

      <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl top-10 left-10" />

      <div className="absolute w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl bottom-10 right-10" />

      {/* Home Card */}

      <div className="relative max-w-2xl w-full bg-surface/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]">

        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-600 dark:from-blue-400 dark:via-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
          Freelancer SaaS
        </h1>

        <p className="mt-5 text-text-secondary text-lg leading-relaxed">
          AI invoice and money management platform for freelancers.
        </p>

        <Link
          href="/create-invoice"
          className="mt-8 inline-block bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-emerald-600 hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
        >
          Create Invoice
        </Link>

      </div>
    </main>
  );
}