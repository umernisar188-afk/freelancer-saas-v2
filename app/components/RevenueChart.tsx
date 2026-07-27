"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";



const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const totals = new Array(12).fill(0);

export default function RevenueChart({ invoices }: { invoices: any[] }) {
  // compute totals per month from the provided invoices prop
  invoices.forEach((invoice) => {
    const date = new Date(invoice.date);
    const month = date.getMonth();
    totals[month] += Number(invoice.amount);
  });

  const data = monthNames.map((month, index) => ({ month, revenue: totals[index] }));

  const bestMonth = data.reduce((best, current) => (current.revenue > best.revenue ? current : best));
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mt-10">

      <div className="flex justify-between items-center mb-8">

        <div>
<div className="flex justify-between items-center">

  <div>

    <p className="text-sm uppercase tracking-widest text-blue-500 font-semibold">
      Analytics
    </p>

    <h2 className="text-3xl font-bold text-gray-900 mt-1">
      Revenue Overview
    </h2>

    <p className="text-gray-500 mt-2">
      Monthly business performance
    </p>

  </div>

  <div className="bg-blue-50 rounded-2xl px-5 py-3 text-right">

  <p className="text-sm text-gray-500">
    🔥 Best Month
  </p>

  <h2 className="text-xl font-bold text-blue-600">
    {bestMonth.month}
  </h2>

  <p className="text-sm text-gray-700">
    ${bestMonth.revenue}
  </p>

</div>

</div>
          
        </div>

        <div className="text-right">

          <p className="text-sm text-gray-500">
            Total
          </p>

          <h2 className="text-3xl font-bold text-blue-600">
  $
  {invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount),
    0
  )}
</h2>
        </div>

      </div>

      <div style={{ width: "100%", height: 320 }}>

        <ResponsiveContainer>

  <LineChart
  
    data={data}
    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
  >
<defs>

  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">

    <stop
      offset="5%"
      stopColor="#3f25eb"
      stopOpacity={0.45}
    />

    <stop
      offset="95%"
      stopColor="#2563EB"
      stopOpacity={0}
    />

  </linearGradient>

</defs>
<defs>
  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.45} />
    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
  </linearGradient>
</defs>
    <CartesianGrid
      stroke="#E5E7EB"
      strokeDasharray="4 4"
    />
<XAxis
  dataKey="month"
  tick={{
    fill: "#374151",
    fontSize: 14,
    fontWeight: 600,
  }}
  axisLine={false}
  tickLine={false}
/>
    <YAxis
  tick={{
    fill: "#374151",
    fontSize: 13,
  }}
  axisLine={false}
  tickLine={false}
/>

    

    <Tooltip
      contentStyle={{
        borderRadius: 16,
        border: "none",
        boxShadow: "0 15px 40px rgba(0,0,0,.15)",
        background: "#ffffff"
      }}
    />

<Line
  type="monotone"
  dataKey="revenue"
  stroke="#2563EB"
  strokeWidth={5}
  animationDuration={1800}
  dot={{
    r: 5,
    stroke: "#2563EB",
    strokeWidth: 2,
    fill: "#ffffff",
  }}
  activeDot={{
    r: 9,
    fill: "#2563EB",
    stroke: "#ffffff",
    strokeWidth: 3,
  }}
  style={{
    filter: "drop-shadow(0px 0px 10px rgba(37,99,235,.45))",
  }}
/>

  </LineChart>

</ResponsiveContainer>
      </div>

    </div>
  );
}