"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  user_id: string;
  created_at: string;
};

export default function ClientsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  async function loadClients(userId: string) {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD CLIENTS ERROR:", error);
      alert(error.message);
      return;
    }

    setClients(data || []);
  }

  useEffect(() => {
    async function initialize() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      await loadClients(user.id);

      setLoading(false);
    }

    initialize();
  }, [router]);

  async function addClient() {
    if (!name.trim() || !email.trim()) {
      alert("Please fill in Name and Email");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in first.");
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("clients")
      .insert({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        phone: phone.trim(),
        user_id: user.id,
      });

    if (error) {
      console.error("ADD CLIENT ERROR:", error);
      alert(error.message);
      return;
    }

    setName("");
    setEmail("");
    setCompany("");
    setPhone("");

    await loadClients(user.id);

    alert("Client saved successfully!");
  }

  async function deleteClient(clientId: string) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in first.");
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId)
      .eq("user_id", user.id);

    if (error) {
      console.error("DELETE CLIENT ERROR:", error);
      alert(error.message);
      return;
    }

    await loadClients(user.id);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl font-semibold text-text-primary">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary">
          👥 Clients
        </h1>

        <p className="text-text-secondary mt-3">
          Save your clients once and reuse them forever.
        </p>

        <div className="mt-10 bg-surface/70 backdrop-blur-2xl rounded-3xl border border-border shadow-xl p-6 sm:p-8">

          <div className="grid md:grid-cols-2 gap-5">

            <input
              placeholder="Client Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-4 rounded-2xl border border-border bg-input text-text-primary placeholder:text-text-secondary"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 rounded-2xl border border-border bg-input text-text-primary placeholder:text-text-secondary"
            />

            <input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="p-4 rounded-2xl border border-border bg-input text-text-primary placeholder:text-text-secondary"
            />

            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-4 rounded-2xl border border-border bg-input text-text-primary placeholder:text-text-secondary"
            />

          </div>

          <button
            type="button"
            onClick={addClient}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition"
          >
            ➕ Add Client
          </button>

        </div>

        {clients.length === 0 ? (
          <div className="mt-10 bg-surface rounded-3xl border border-border shadow-xl p-10 text-center">

            <p className="text-text-secondary text-lg">
              No clients yet.
            </p>

          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-surface rounded-3xl border border-border shadow-2xl p-8"
              >

                <p className="text-text-primary font-semibold text-lg mt-2">
                  {client.name}
                </p>

                <p className="text-text-secondary mt-2">
                  📧 {client.email}
                </p>

                <p className="text-text-secondary mt-1">
                  🏢 {client.company || "No company"}
                </p>

                <p className="text-text-secondary mt-1">
                  📞 {client.phone || "No phone"}
                </p>

                <button
                  type="button"
                  onClick={() => deleteClient(client.id)}
                  className="mt-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}