import Link from "next/link";
export default function Home() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex items-center justify-center p-10">

      <div className="max-w-2xl w-full bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-10">

        <h1 className="text-5xl font-bold text-green-700">
          Freelancer SaaS
        </h1>

        <p className="mt-5 text-gray-700 text-lg">
          AI invoice and money management platform for freelancers.
        </p>

        <Link
  href="/create-invoice"
  className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
>
  Create Invoice
</Link>
      </div>

    </main>
  );
}