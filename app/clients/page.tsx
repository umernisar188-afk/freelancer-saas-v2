"use client";

import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";
export default function ClientsPage() {
 const [clients, setClients] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
async function loadClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setClients(data || []);
}

useEffect(() => {
  loadClients();
}, []);
  async function addClient() {
  if (!name || !email) {
    alert("Please fill in Name and Email");
    return;
  }

  const { error } = await supabase
    .from("clients")
    .insert([
      {
        name,
        email,
        company,
      },
    ]);

  if (error) {
  console.error(error);
  alert(error.message);
  return;
}

  alert("✅ Client saved!");
await loadClients();
  setName("");
  setEmail("");
  setCompany("");

  loadClients();
}
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-extrabold text-gray-900">
          👥 Clients
        </h1>

        <p className="text-gray-500 mt-3">
          Save your clients once and reuse them forever.
        </p>

        <div className="mt-10 bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-xl p-8">

          <div className="grid md:grid-cols-3 gap-5">

            <input
              placeholder="Client Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 rounded-2xl border border-gray-200 bg-white"
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 rounded-2xl border border-gray-200 bg-white"
            />

            <input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="p-4 rounded-2xl border border-gray-200 bg-white"
            />

          </div>

          <button
            onClick={addClient}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition"
          >
            ➕ Add Client
          </button>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {client.name}
              </h2>

              <p className="text-gray-500 mt-2">
                📧 {client.email}
              </p>

              <p className="text-gray-500">
                🏢 {client.company || "No company"}
              </p>

              <button
                onClick={async () => {
  await supabase
    .from("clients")
    .delete()
    .eq("id", client.id);

  await loadClients();
}}
                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
              >
                Delete
              </button>
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}