"use client";
import { useState } from "react";
import { saveInvoice } from "../lib/invoiceStore";
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
const clients = getClients();
const [company, setCompany] = useState("");
const [selectedClient, setSelectedClient] = useState("");
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-6 pb-12 px-6">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
  📝 Create Invoice
</h1>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        
<div

  className="
    bg-white/70
    backdrop-blur-2xl
    rounded-3xl
    border
    border-white/50
    shadow-2xl
    p-10
    transition-all
    duration-300
    hover:-translate-y-1
    hover:scale-[1.01]
  "
></div>


<p className="mt-3 text-lg text-gray-500">
  Create professional invoices in seconds.
</p>

        <div className="mt-8 space-y-5">
<input
  className="
w-full
p-4
rounded-2xl
bg-white/80
border
border-gray-200
text-gray-900
placeholder:text-gray-400
shadow-sm
focus:outline-none
focus:ring-4
focus:ring-blue-300
focus:border-blue-500
transition-all
duration-300
hover:border-blue-300
hover:scale-[1.01]
"

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
  className="w-full p-4 rounded-2xl bg-white/80 border border-gray-200 text-gray-900 shadow-sm"
>
  <option value="">
    Select Client
  </option>

  {clients.map((client) => (
    <option
      key={client.id}
      value={client.name}
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
bg-white/80
border
border-gray-200
text-gray-900
placeholder:text-gray-400
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
bg-white/80
border
border-gray-200
text-gray-900
placeholder:text-gray-400
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
  className="w-full p-4 rounded-xl bg-white/80 border border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
  placeholder="Project name"
  value={project}
onChange={(e) => setProject(e.target.value)}
/>

<input
  className="w-full p-4 rounded-xl bg-white/80 border border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
  placeholder="Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  />
  <p>
  <span className="font-semibold text-gray-900">
    Due Date:
  </span>{" "}
  {dueDate || "Not selected"}
</p>
<input
  type="date"
  className="w-full p-4 rounded-2xl bg-white/70 border border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>
<select
  className="w-full p-4 rounded-2xl bg-white/70 border border-gray-200 text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option>Pending</option>
  <option>Paid</option>
</select>
          <textarea
  className="w-full p-4 rounded-xl bg-white/80 border border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
  placeholder="Project details"
  value={details}
  onChange={(e) => setDetails(e.target.value)}
/>
<button
  type="button"
  onClick={async () => {
    const { error } = await supabase
      .from("invoices")
      .insert([
        {
          id: Date.now().toString(),
          date: new Date().toISOString(),
client_name: client,
email: email,
company: company,
projects: project,
amount: amount,
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
to-indigo-600
text-white
font-bold
text-lg
shadow-lg
hover:shadow-2xl
hover:scale-[1.02]
hover:from-blue-700
hover:to-indigo-700
transition-all
duration-300
"
>
  🚀 Generate Invoice
</button>
        </div>
      </div>

<div className="mt-8 border-t border-gray-200 pt-6">

  <div className="flex justify-between items-center">

    <span className="text-lg font-semibold text-gray-500">
      Total
    </span>

    <span className="text-4xl font-extrabold text-blue-600">
      ${amount || "0"}
    </span>

  </div>

</div>
  <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">

  <span className="text-lg font-semibold text-gray-600">
    Total
  </span>
<div className="mt-10 border-t border-dashed border-gray-300 pt-6">

  <p className="text-center text-gray-500 italic">
    Thank you for your business ❤️
  </p>

</div>
  <span className="text-3xl font-extrabold text-blue-600">
    ${amount || "0"}
  </span>

</div>

<div className="mt-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 p-8 shadow-lg text-gray-800 space-y-5">
<div className="flex justify-between items-start border-b border-gray-200 pb-6">

  <div>

    <h3 className="text-3xl font-extrabold text-gray-900">
      Freelancer SaaS
    </h3>

    <p className="text-gray-500">
      Professional Invoice
    </p>

  </div>

  <div className="text-right">

    <p className="text-sm text-gray-400">
      Invoice
    </p>

    <h3 className="text-xl font-bold text-blue-600">
      #{Date.now().toString().slice(-6)}
    </h3>

  </div>

</div>
<div className="mb-8">

  <h1 className="text-3xl font-extrabold text-gray-900">
    Freelancer SaaS
  </h1>

  <p className="text-gray-500">
    Professional Invoice
  </p>

  <div className="mt-5 flex justify-between">

    <div>

      <p className="text-gray-400 text-sm">
        Invoice #
      </p>

      <h3 className="font-bold text-gray-900">
        {Date.now().toString().slice(-6)}
      </h3>

    </div>

    <div className="text-right">

      <p className="text-gray-400 text-sm">
        Created
      </p>

      <h3 className="font-bold text-gray-900">
        {new Date().toLocaleDateString()}
      </h3>

    </div>

  </div>

</div>
    <p>
      <span className="font-semibold text-gray-900">
        Client:
      </span>{" "}
      {client || "No client"}
    </p>
    <h4 className="text-lg font-bold text-gray-800 mb-4">
  Bill To
</h4>
<div className="border-b border-gray-200 pb-5 mb-5">
  

  <p className="text-gray-500">
    Professional Invoice
  </p>

  <p className="text-sm text-gray-400 mt-2">
    #{Date.now().toString().slice(-6)}
  </p>
</div>
<div className="border-b border-gray-200 pb-5 mb-5">
  <h3 className="text-2xl font-bold text-gray-900">
    Freelancer SaaS
  </h3>

  <p className="text-gray-500">
    Professional Invoice
  </p>

  <p className="text-sm text-gray-400 mt-2">
    #{Date.now().toString().slice(-6)}
  </p>
</div>
    <p>
     <span className="font-semibold text-gray-900">
        Email:
      </span>{" "}
      {email || "No email"}
    </p>
<p>
  <span className="font-semibold text-gray-900">
    Company:
  </span>{" "}
  {company || "No company"}
</p>

    <p>
     <span className="font-semibold text-gray-900">
        Project:
      </span>{" "}
      {project || "No project"}
    </p>


    <p>
    <span className="font-semibold text-gray-900">
        Amount:
      </span>{" "}
      ${amount || "0"}
    </p>


    <p>
     <span className="font-semibold text-gray-900">
        Details:
      </span>{" "}
      {details || "No details"}
    </p>
<div className="mt-8 border-t border-gray-200 pt-6">

  <div className="flex justify-between items-center">

    <span className="text-lg font-semibold text-gray-500">
      Total
    </span>

    <span className="text-4xl font-extrabold text-blue-600">
      ${amount || "0"}
    </span>

  </div>

</div>
    <p>
     <span className="font-semibold text-gray-900">
        Due Date:
      </span>{" "}
      {dueDate || "Not selected"}
    </p>

  </div>
    </main>
  );
}