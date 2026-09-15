"use client";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";
import jsPDF from "jspdf"; 
import { useRouter } from "next/navigation";
import RevenueChart from "../components/RevenueChart";
export default function DashboardPage() {
const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("All");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const router = useRouter();
  useEffect(() => {
  }, [router]);
const totalClients = new Set(
  invoices.map((invoice) => invoice.client_name)
).size;
async function loadInvoices() {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setInvoices(data || []);
}
  useEffect(() => {
  async function loadDashboardData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("name, email, phone, logo")
      .eq("user_id", user.id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (companyError) {
      console.error("LOAD COMPANY ERROR:", companyError);
      return;
    }

    if (companyData) {
      setCompany(companyData);
    }

    await loadInvoices();
  }

  loadDashboardData();
}, [router]);
const totalRevenue = invoices
  .filter((invoice) => invoice.status === "Paid")
  .reduce((sum, invoice) => {
    const amount = Number(invoice.amount);
    return Number.isNaN(amount) ? sum : sum + amount;
  }, 0);
const totalInvoices = invoices.length;
const pendingInvoices = invoices
  .filter((invoice) => invoice.status === "Pending")
  .reduce((sum, invoice) => {
    const amount = Number(invoice.amount);
    return Number.isNaN(amount) ? sum : sum + amount;
  }, 0);
  const hour = new Date().getHours();

let greeting = "Good Evening 🌙";

if (hour < 12) {
  greeting = "Good Morning 🌅";
} else if (hour < 18) {
  greeting = "Good Afternoon ☀️";
}
const filteredInvoices = invoices.filter((invoice) =>
  invoice.client_name.toLowerCase().includes(search.toLowerCase()) ||
  invoice.projects.toLowerCase().includes(search.toLowerCase()) ||
  String(invoice.id).includes(search)
);
const sortedInvoices = [...filteredInvoices].sort(
  (a: any, b: any) => {
    if (sort === "amount") {
      return Number(b.amount) - Number(a.amount);
    }
    if (sort === "pending") {
      return a.status === "Pending" ? -1 : 1;
    }
    return Number(b.id || 0) - Number(a.id || 0);
  }
);

  return (
  
   <main className="min-h-screen bg-background">
<div className="bg-surface/75 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-border p-10 transition-all duration-300">
  <div className="flex items-center justify-between flex-wrap gap-6 mb-8">

    <div className="flex items-center gap-4">

      {company?.logo && (
        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border bg-input flex items-center justify-center shadow-lg transition-colors duration-300">
          <img
            src={company.logo}
            alt="Company Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
      )}

      <div>
        <p className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
          Welcome Back 👋
        </p>

       <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-600 dark:from-blue-400 dark:via-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
  {company?.name || "Freelancer SaaS"}
</h1>

        <p className="text-text-secondary mt-3 text-lg">
          Manage invoices, clients and revenue from one beautiful dashboard.
        </p>
      </div>

    </div>

    <ThemeToggle />

  </div>

{/* Menu Button */}
<button
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="fixed top-5 left-5 z-[60] w-12 h-12 rounded-xl bg-slate-950 text-white shadow-xl flex items-center justify-center text-2xl hover:bg-slate-800 transition"
  aria-label="Toggle menu"
>
  {sidebarOpen ? "✕" : "☰"}
</button>

{/* Sidebar Overlay */}
{sidebarOpen && (
  <div
    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    onClick={() => setSidebarOpen(false)}
  />
)}

{/* Sidebar */}
<div
  className={`fixed left-0 top-0 z-50 h-screen w-64 bg-slate-950 text-white shadow-2xl border-r border-slate-800 flex flex-col transition-transform duration-300 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  <div className="p-6 border-b border-slate-800">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center font-extrabold text-lg">
        FS
      </div>

      <div>
        <p className="font-bold text-lg">Freelancer SaaS</p>
        <p className="text-xs text-slate-400">Business Dashboard</p>
      </div>
    </div>
  </div>

  <nav className="flex-1 p-4 space-y-2">
    <Link
      href="/dashboard"
      onClick={() => setSidebarOpen(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 font-semibold hover:bg-blue-700 transition"
    >
      🏠 Dashboard
    </Link>

    <Link
      href="/clients"
      onClick={() => setSidebarOpen(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
    >
      👥 Clients
    </Link>

    <Link
      href="/invoices"
      onClick={() => setSidebarOpen(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
    >
      📄 Invoices
    </Link>

    <Link
      href="/settings"
      onClick={() => setSidebarOpen(false)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
    >
      ⚙️ Company Settings
    </Link>
  </nav>

  <div className="p-4 border-t border-slate-800">
    <button
      onClick={async () => {
        setSidebarOpen(false);
        await supabase.auth.signOut();
        router.push("/login");
      }}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 font-semibold transition"
    >
      🚪 Logout
    </button>
  </div>
</div>

<div className="mt-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 p-8 shadow-2xl text-white transition-all duration-300">

  <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

    <div>

      <p className="uppercase tracking-widest text-blue-100 font-semibold">
        Business Overview
      </p>

      <h2 className="text-5xl font-extrabold mt-3">
        ${totalRevenue}
      </h2>

      <p className="text-blue-100 mt-3 text-lg">
        Total revenue from paid invoices
      </p>

    </div>

    <Link
      href="/create-invoice"
      className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-[1.03] hover:shadow-2xl transition-all duration-300"
    >
      + Create Invoice
    </Link>

  </div>

</div>
  {/* Revenue */}
  <div className="bg-white/25 dark:bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/40 dark:border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
    <div className="text-4xl">💰</div>

  <p className="text-text-secondary mt-3">
      Total Revenue
    </p>

    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent mt-2">
      ${totalRevenue}
    </h2>

  </div>

  {/* Invoices */}
  <div className="bg-white/25 dark:bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/40 dark:border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

    <div className="text-4xl">📄</div>

    <p className="text-text-secondary mt-3">
      Total Invoices
    </p>

    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent mt-2">
      {totalInvoices}
    </h2>

  </div>

  {/* Clients */}
  <div className="bg-white/25 dark:bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/40 dark:border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

    <div className="text-4xl">👥</div>

    <p className="text-text-secondary mt-3">
      Clients
    </p>

    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent mt-2">
      {totalClients}
    </h2>

  </div>

  {/* Pending */}
  <div className="bg-white/25 dark:bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/40 dark:border-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

    <div className="text-4xl">⏳</div>

    <p className="text-text-secondary mt-3">
      Pending Amount
    </p>

    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent mt-2">
      ${pendingInvoices}
    </h2>

  </div>

      </div>
        <div className="mt-10">
<h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
  Recent Invoices
</h2>
          <div className="mt-5 space-y-4 bg-surface/60 dark:bg-slate-900/40 rounded-3xl p-5 border border-border backdrop-blur-xl shadow-lg">
<div className="relative mb-6">

  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
    🔍
  </span>
  <input
    className="
      w-full
      pl-12
      pr-4
      py-4
      rounded-2xl
      border
      border-border
      bg-input
      text-text-primary
      shadow-sm
      focus:outline-none
      focus:ring-4
      focus:ring-blue-400/30
      focus:border-blue-500
      transition-all
      duration-300
    "
    placeholder="Search invoices..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>
<select
  className="w-full p-4 rounded-xl border border-border text-text-primary bg-surface/80 dark:bg-slate-800/70 backdrop-blur-xl mb-5 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-emerald-500/30 transition-all duration-300"
  value={sort}
  onChange={(e) => setSort(e.target.value)}
>
  <option value="newest">
    Newest
  </option>

  <option value="amount">
    Highest Amount
  </option>

  <option value="pending">
    Pending First
  </option>
</select>
{sortedInvoices.map((invoice, index) => (
  <div
    key={invoice.id ?? index}
   className="bg-surface/80 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-7 shadow-lg border border-border hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
  >
            <div className="flex justify-between items-start">

  <div>

    <h3 className="text-2xl font-bold text-text-primary">
      👤 {invoice.client_name}
    </h3>

    <p className="text-sm text-text-secondary mt-2">
      {invoice.projects}
    </p>

    <p className="text-sm text-text-secondary mt-2">
      Invoice #{invoice.id}
    </p>

  </div>

  <div className="text-right">
<p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
  ${invoice.amount}
</p>
   <span
  className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
    invoice.status === "Paid"
      ? "bg-emerald-500 text-white dark:bg-emerald-600"
      : "bg-blue-500 text-white dark:bg-blue-600"
  }`}
>
  {invoice.status === "Paid" ? "🟢 Paid" : "🔵 Pending"}
</span>

  </div>

</div> 
<div className="flex flex-wrap gap-3 mt-6">

  <button
   className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:from-emerald-600 hover:to-blue-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    onClick={async () => {

  const newStatus =
    invoice.status === "Paid" ? "Pending" : "Paid";

  const { error } = await supabase
    .from("invoices")
    .update({
      status: newStatus,
    })
    .eq("id", invoice.id);

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  await loadInvoices();

}}
  >
    {invoice.status === "Paid"
  ? "🔵 Mark Pending"
  : "🟢 Mark Paid"}
  </button>

  <button
  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    onClick={() => {

      setEditingIndex(index);

      setTimeout(() => {
        document
          .getElementById(`edit-${index}`)
          ?.scrollIntoView({
            behavior: "smooth"
          });
      }, 100);

    }}
  >
    ✏ Edit
  </button>

  <button
   className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:from-blue-600 hover:to-emerald-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    onClick={() => {
      window.location.href = `/invoice/${invoice.id}`;
    }}
  >
    👁 Preview
  </button>

  <button
   className="bg-red-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-red-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    onClick={async () => {

  console.log("DELETE CLICKED", invoice.id);
const { data, error } = await supabase
  .from("invoices")
  .delete()
  .eq("id", invoice.id)
  .select();

console.log("Deleted rows:", data);
console.log("Error:", error);
  console.log("DELETE ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  await loadInvoices();
}}
  >
    🗑 Delete
  </button>

</div>
{editingIndex === index && (

  <div className="mt-5 space-y-3">

    <input
      className="w-full p-3 rounded-xl border border-border text-text-primary bg-input"
      defaultValue={invoice.client_name}
      placeholder="Client"
      id={`client-${index}`}
    />


    <input
      className="w-full p-3 rounded-xl border border-border text-text-primary bg-input"
      defaultValue={invoice.email}
      placeholder="Email"
      id={`email-${index}`}
    />


    <input
      className="w-full p-3 rounded-xl border border-border text-text-primary bg-input"
      defaultValue={invoice.projects}
      placeholder="Project"
      id={`project-${index}`}
    />


    <input
      className="w-full p-3 rounded-xl border border-border text-text-primary bg-input"
      defaultValue={invoice.amount}
      placeholder="Amount"
      id={`amount-${index}`}
    />
<input
  className="w-full p-3 rounded-xl border border-border text-text-primary bg-input"
  type="date"
  defaultValue={invoice.duedate || ""}
  id={`dueDate-${index}`}
/>
<select
  className="w-full p-3 rounded-xl border border-border text-text-primary bg-input"
  defaultValue={invoice.status || "Pending"}
  id={`status-${index}`}
>

  <option className="text-black" value="Draft">
    Draft
  </option>

  <option className="text-black" value="Pending">
    Pending
  </option>

  <option className="text-black" value="Paid">
    Paid
  </option>

  <option className="text-black" value="Overdue">
    Overdue
  </option>

  <option className="text-black" value="Cancelled">
    Cancelled
  </option>

</select>
    <textarea
      className="w-full p-3 rounded-xl border border-border text-text-primary bg-input"
      defaultValue={invoice.details}
      placeholder="Details"
      id={`details-${index}`}
    />

<button
  className="bg-green-500 text-white font-bold px-5 py-2 rounded-xl hover:bg-green-400 transition"
  onClick={async () => {

  const amountInput = document.getElementById(
    `amount-${index}`
  ) as HTMLInputElement;

  const numericAmount = Number(amountInput.value);

  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    alert("Please enter a valid invoice amount.");
    return;
  }

  const { error } = await supabase
      .from("invoices")
      .update({
        client_name: (document.getElementById(`client-${index}`) as HTMLInputElement).value,

        email: (document.getElementById(`email-${index}`) as HTMLInputElement).value,

        projects: (document.getElementById(`project-${index}`) as HTMLInputElement).value,

        amount: numericAmount,

        duedate: (document.getElementById(`dueDate-${index}`) as HTMLInputElement).value,

        status: (document.getElementById(`status-${index}`) as HTMLSelectElement).value,

        details: (document.getElementById(`details-${index}`) as HTMLTextAreaElement).value,
      })
      .eq("id", invoice.id);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    await loadInvoices();
    setEditingIndex(null);

  }}
>
  Save Changes
</button>
<button
  className="ml-3 bg-slate-500 text-white font-bold px-5 py-2 rounded-xl hover:bg-slate-400 transition"
  onClick={async () => {
    await loadInvoices();
    setEditingIndex(null);
  }}
>
  Cancel
</button>
            </div>
          )}
            </div>
          ))}
        </div>

        <RevenueChart invoices={invoices} />
      </div>
    </main>
    
  );
}
