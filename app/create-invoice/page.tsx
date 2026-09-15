"use client";

import { useEffect, useState } from "react";
import { getClients } from "../lib/clientstore";
import { supabase } from "../lib/supabase";
export default function CreateInvoice() {
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");

  const [clients, setClients] = useState<any[]>([]);

  const [company, setCompany] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  useEffect(() => {
    async function loadClients() {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("CLIENT LOAD ERROR:", error);
        return;
      }

      setClients(data ?? []);
    }

    loadClients();
  }, []);
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 dark:from-slate-950 dark:via-blue-950 dark:to-emerald-950 text-text-primary pt-8 pb-12 px-6 transition-colors duration-300">

      {/* Background Glow */}

      <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl top-10 left-10 pointer-events-none" />

      <div className="absolute w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl bottom-10 right-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-100 via-white to-emerald-100 bg-clip-text text-transparent">
          📝 Create Invoice
        </h1>

        <p className="mt-3 text-lg text-white/85">
          Create professional invoices in seconds.
        </p>

        <div className="mt-8 grid lg:grid-cols-2 gap-8 items-start">

          {/* Invoice Form */}

          <div className="bg-surface/80 dark:bg-slate-800/75 backdrop-blur-2xl rounded-3xl border border-border shadow-2xl p-6 sm:p-10 transition-all duration-300">

            <div className="space-y-5">

              <input
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-input
                  border
                  border-border
                  text-text-primary
                  placeholder:text-text-secondary
                  shadow-sm
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-300
                  focus:border-blue-500
                  transition-all
                  duration-300
                  hover:border-blue-300
                "
                placeholder="Client Name"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />

              <select
                value={selectedClient}
                onChange={(e) => {
                  const value = e.target.value;

                  setSelectedClient(value);

                  const clientData = clients.find(
                    (client) => client.name === value
                  );

                  if (!clientData) return;

                  setClient(clientData.name);
                  setEmail(clientData.email);
                  setCompany(clientData.company);
                }}
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-input
                  border
                  border-border
                  text-text-primary
                  shadow-sm
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-300
                  focus:border-blue-500
                  transition-all
                  duration-300
                "
              >
                <option
                  value=""
                  className="bg-input text-text-primary"
                >
                  Select Client
                </option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.name}
                    className="bg-input text-text-primary"
                  >
                    {client.name}
                  </option>
                ))}
              </select>

              <input
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-input
                  border
                  border-border
                  text-text-primary
                  placeholder:text-text-secondary
                  shadow-sm
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-300
                  focus:border-blue-500
                  transition-all
                  duration-300
                  hover:border-blue-300
                "
                placeholder="Client Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-input
                  border
                  border-border
                  text-text-primary
                  placeholder:text-text-secondary
                  shadow-sm
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-300
                  focus:border-blue-500
                  transition-all
                  duration-300
                  hover:border-blue-300
                "
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />

              <input
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-input
                  border
                  border-border
                  text-text-primary
                  placeholder:text-text-secondary
                  shadow-sm
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-300
                  focus:border-blue-500
                  transition-all
                  duration-300
                  hover:border-blue-300
                "
                placeholder="Project Name"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
<input
  type="number"
  min="0"
  step="0.01"
  inputMode="decimal"
  className="
    w-full
    p-4
    rounded-xl
    bg-input
    border
    border-border
    text-text-primary
    placeholder:text-text-primary
    shadow-sm
    focus:outline-none
    focus:ring-4
    focus:ring-blue-300
    transition-all
    duration-300
  "
  placeholder="Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>
              

              <div className="rounded-2xl border border-border bg-surface/50 p-4">
                <p className="text-sm text-text-secondary mb-1">
                  Due Date
                </p>

                <p className="font-semibold text-text-primary mb-3">
                  {dueDate || "Not selected"}
                </p>

                <input
                  type="date"
                  className="
                    w-full
                    p-4
                    rounded-2xl
                    bg-input
                    border
                    border-border
                    text-text-primary
                    shadow-sm
                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-300
                    focus:border-blue-500
                    transition-all
                    duration-300
                  "
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <select
                className="
                  w-full
                  p-4
                  rounded-2xl
                  bg-input
                  border
                  border-border
                  text-text-primary
                  shadow-sm
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-300
                  focus:border-blue-500
                  transition-all
                  duration-300
                "
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Pending</option>
                <option>Paid</option>
              </select>

              <textarea
                className="
                  w-full
                  min-h-32
                  p-4
                  rounded-2xl
                  bg-input
                  border
                  border-border
                  text-text-primary
                  placeholder:text-text-secondary
                  shadow-sm
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-300
                  focus:border-blue-500
                  transition-all
                  duration-300
                  resize-none
                "
                placeholder="Project Details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />

              <button
                type="button"
                onClick={async () => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    alert("Please enter a valid invoice amount.");
    return;
  }
  const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  alert("You must be logged in to create an invoice.");
  return;
}

const { error } = await supabase
  .from("invoices")
  .insert([
    {
      id: Date.now().toString(),
      user_id: user.id,
      date: new Date().toISOString(),
      client_name: client,
      email: email,
      company: company,
      projects: project,
      amount: numericAmount,
      details: details,
      status: status,
      duedate: dueDate,
    },
  ]);

                  if (error) {
                    console.error(error);
                    alert(error.message);
                    return;
                  }

                  alert("✅ Invoice saved!");
                }}
                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-emerald-500
                  text-white
                  font-bold
                  text-lg
                  shadow-lg
                  hover:shadow-2xl
                  hover:scale-[1.02]
                  hover:from-blue-700
                  hover:to-emerald-600
                  transition-all
                  duration-300
                "
              >
                🚀 Generate Invoice
              </button>

            </div>
          </div>

          {/* Invoice Preview */}

          <div className="space-y-6">

            <div className="bg-surface/80 dark:bg-slate-800/75 backdrop-blur-2xl rounded-3xl border border-border p-6 sm:p-8 shadow-2xl text-text-primary">

              <div className="flex justify-between items-center">

                <span className="text-lg font-semibold text-text-primary">
                  Total
                </span>

                <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  ${amount || "0"}
                </span>

              </div>

              <div className="mt-10 border-t border-dashed border-border pt-6">
                <p className="text-center text-text-secondary italic">
                  Thank you for your business ❤️
                </p>
              </div>

            </div>

            {/* Invoice Preview Card */}

            <div className="bg-surface/80 dark:bg-slate-800/75 backdrop-blur-2xl rounded-3xl border border-border p-6 sm:p-8 shadow-2xl text-text-primary">

              <div className="flex justify-between items-start border-b border-border pb-6">

                <div>
                  <h3 className="text-3xl font-extrabold text-text-primary">
                    Freelancer SaaS
                  </h3>

                  <p className="text-text-secondary">
                    Professional Invoice
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-text-secondary">
                    Invoice
                  </p>

                  <h3 className="text-xl font-bold text-blue-600 dark:text-emerald-400">
                    #{Date.now().toString().slice(-6)}
                  </h3>
                </div>

              </div>

              <div className="mb-8 pt-6">

                <div className="mt-5 flex justify-between gap-6">

                  <div>
                    <p className="text-sm text-text-secondary">
                      Invoice #
                    </p>

                    <h3 className="font-bold text-text-primary">
                      {Date.now().toString().slice(-6)}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-text-secondary">
                      Created
                    </p>

                    <h3 className="font-bold text-text-primary">
                      {new Date().toLocaleDateString()}
                    </h3>
                  </div>

                </div>

              </div>

              <div className="space-y-4">

                <div>
                  <p className="text-sm text-text-secondary">
                    Bill To
                  </p>

                  <p className="font-semibold text-text-primary mt-1">
                    {client || "No client"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Email
                  </p>

                  <p className="font-semibold text-text-primary mt-1">
                    {email || "No email"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Company
                  </p>

                  <p className="font-semibold text-text-primary mt-1">
                    {company || "No company"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Project
                  </p>

                  <p className="font-semibold text-text-primary mt-1">
                    {project || "No project"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Amount
                  </p>

                  <p className="font-semibold text-text-primary mt-1">
                    ${amount || "0"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Details
                  </p>

                  <p className="font-semibold text-text-primary mt-1">
                    {details || "No details"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary">
                    Due Date
                  </p>

                  <p className="font-semibold text-text-primary mt-1">
                    {dueDate || "Not selected"}
                  </p>
                </div>

              </div>

              <div className="mt-8 border-t border-border pt-6">

                <div className="flex justify-between items-center">

                  <span className="text-lg font-semibold text-text-primary">
                    Total
                  </span>

                  <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                    ${amount || "0"}
                  </span>

                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}