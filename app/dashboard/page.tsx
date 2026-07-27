"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCompany } from "../lib/companyStore";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf"; 

import RevenueChart from "../components/RevenueChart";

export default function DashboardPage() {

  const [invoices, setInvoices] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("All");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
  loadInvoices();
  setCompany(getCompany());
}, []);
const totalRevenue = invoices
  .filter((invoice) => invoice.status === "Paid")
  .reduce(
    (sum, invoice) => sum + Number(invoice.amount),
    0
  );
const totalInvoices = invoices.length;


const pendingInvoices = invoices
  .filter((invoice) => invoice.status === "Pending")
  .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 p-10">

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-green-100 p-10">
<div className="flex items-center gap-5">


<div>

<div className="flex items-center justify-between flex-wrap gap-5">

<div className="flex items-center gap-4">
{company?.logo && (

<div className="w-12 h-12 flex-shrink-0 rounded-xl border-2 border-black bg-white flex items-center justify-center overflow-hidden">
<img
src="/logo.png"
alt="Company Logo"
className="w-10 h-10 object-contain rounded-lg"
/>
</div>

)}
<div>
<div className="flex flex-col">

  <p className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
    Welcome Back 👋
  </p>

  <h1 className="text-5xl font-extrabold text-gray-900 mt-2">
    {company?.name || "Freelancer SaaS"}
  </h1>

  <p className="text-gray-500 mt-3 text-lg">
    Manage invoices, clients and revenue from one beautiful dashboard.
  </p>

</div>

</div>


</div>


<Link

href="/settings"
className="
bg-blue-600
hover:bg-blue-700
text-white
font-semibold
px-6
py-3
rounded-xl
shadow-lg
transition
duration-300
hover:scale-105
"

>

Company Settings

</Link>


</div>
<p className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
  {greeting}
</p>

<div className="mt-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 shadow-2xl text-white">

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
      className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
    >
      + Create Invoice
    </Link>

  </div>

</div>
  {/* Revenue */}
  <div className="bg-white rounded-3xl p-7 shadow-md border border-gray-100 hover:shadow-xl transition">

    <div className="text-4xl">💰</div>

    <p className="text-gray-500 mt-3">
      Total Revenue
    </p>

    <h2 className="text-4xl font-bold text-gray-900 mt-2">
      ${totalRevenue}
    </h2>

  </div>

  {/* Invoices */}
  <div className="bg-white rounded-3xl p-7 shadow-md border border-gray-100 hover:shadow-xl transition">

    <div className="text-4xl">📄</div>

    <p className="text-gray-500 mt-3">
      Total Invoices
    </p>

    <h2 className="text-4xl font-bold text-gray-900 mt-2">
      {totalInvoices}
    </h2>

  </div>

  {/* Clients */}
  <div className="bg-white rounded-3xl p-7 shadow-md border border-gray-100 hover:shadow-xl transition">

    <div className="text-4xl">👥</div>

    <p className="text-gray-500 mt-3">
      Clients
    </p>

    <h2 className="text-4xl font-bold text-gray-900 mt-2">
      {totalClients}
    </h2>

  </div>

  {/* Pending */}
  <div className="bg-white rounded-3xl p-7 shadow-md border border-gray-100 hover:shadow-xl transition">

    <div className="text-4xl">⏳</div>

    <p className="text-gray-500 mt-3">
      Pending Amount
    </p>

    <h2 className="text-4xl font-bold text-gray-900 mt-2">
      ${pendingInvoices}
    </h2>

  </div>

</div>
      </div>
        <div className="mt-10">

          <h2 className="text-2xl font-bold text-green-700">
            Recent Invoices
          </h2>
          <div className="mt-5 space-y-4">
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
      border-gray-200
      bg-white
      text-gray-900
      shadow-sm
      focus:outline-none
      focus:ring-4
      focus:ring-blue-200
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
  className="w-full p-4 rounded-xl border border-gray-300 text-gray-900 bg-white mb-5"
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
    className="bg-white rounded-3xl p-7 shadow-md border border-gray-100 hover:shadow-xl transition"
  >
            <div className="flex justify-between items-start">

  <div>

    <h3 className="text-2xl font-bold text-gray-900">
      👤 {invoice.client_name}
    </h3>

    <p className="text-gray-500 mt-1">
      {invoice.projects}
    </p>

    <p className="text-sm text-gray-400 mt-2">
      Invoice #{invoice.id}
    </p>

  </div>

  <div className="text-right">

    <p className="text-3xl font-bold text-blue-600">
      ${invoice.amount}
    </p>

    <span
      className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
        invoice.status === "Paid"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {invoice.status === "Paid" ? "🟢 Paid" : "🟡 Pending"}
    </span>

  </div>

</div> 
<div className="flex flex-wrap gap-3 mt-6">

  <button
    className="bg-green-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-green-600 transition"
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
      ? "🟡 Mark Pending"
      : "🟢 Mark Paid"}
  </button>

  <button
    className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-yellow-600 transition"
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
    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
    onClick={() => {
      window.location.href = `/invoice/${invoice.id}`;
    }}
  >
    👁 Preview
  </button>

  <button
    className="bg-red-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-red-600 transition"
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
      className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 bg-white"
      defaultValue={invoice.client_name}
      placeholder="Client"
      id={`client-${index}`}
    />


    <input
      className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 bg-white"
      defaultValue={invoice.email}
      placeholder="Email"
      id={`email-${index}`}
    />


    <input
      className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 bg-white"
      defaultValue={invoice.projects}
      placeholder="Project"
      id={`project-${index}`}
    />


    <input
      className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 bg-white"
      defaultValue={invoice.amount}
      placeholder="Amount"
      id={`amount-${index}`}
    />
<input
  className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 bg-white"
  type="date"
  defaultValue={invoice.duedate || ""}
  id={`dueDate-${index}`}
/>
<select
  className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 bg-white"
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
      className="w-full p-3 rounded-xl border border-gray-300 text-gray-900 bg-white"
      defaultValue={invoice.details}
      placeholder="Details"
      id={`details-${index}`}
    />

<button
  className="bg-green-500 text-black font-bold px-5 py-2 rounded-xl"
  onClick={async () => {

    const { error } = await supabase
      .from("invoices")
      .update({
        client_name: (document.getElementById(`client-${index}`) as HTMLInputElement).value,

        email: (document.getElementById(`email-${index}`) as HTMLInputElement).value,

        projects: (document.getElementById(`project-${index}`) as HTMLInputElement).value,

        amount: (document.getElementById(`amount-${index}`) as HTMLInputElement).value,

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
  className="ml-3 bg-gray-500 text-white font-bold px-5 py-2 rounded-xl"
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

        </div>
        </div>
         <RevenueChart invoices={invoices} />

    </main>
  );
}