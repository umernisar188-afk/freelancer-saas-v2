"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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

export default function RevenueChart({ invoices }: { invoices: any[] }) {
  const totals = new Array(12).fill(0);

  // Safely convert invoice amounts to numbers.
  // Invalid amounts are ignored instead of producing NaN.
  const getValidAmount = (invoice: any) => {
    const amount = Number(invoice?.amount);

    return Number.isFinite(amount) ? amount : 0;
  };

  // Calculate monthly revenue
  invoices.forEach((invoice) => {
    const date = new Date(invoice?.date);
    const month = date.getMonth();

    if (
      !Number.isNaN(date.getTime()) &&
      month >= 0 &&
      month <= 11
    ) {
      totals[month] += getValidAmount(invoice);
    }
  });

  const data = monthNames.map((month, index) => ({
    month,
    revenue: totals[index],
  }));

  const bestMonth = data.reduce(
    (best, current) =>
      current.revenue > best.revenue ? current : best,
    data[0]
  );

  // Safe total revenue calculation
  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + getValidAmount(invoice),
    0
  );

  return (
    <div className="bg-surface/80 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-border p-8 mt-10 transition-all duration-300">

      <div className="flex justify-between items-center mb-8">

        <div className="w-full">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

            <div>

              <p className="text-sm uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                Analytics
              </p>

              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent mt-1">
                Revenue Overview
              </h2>

              <p className="text-text-secondary mt-2">
                Monthly business performance
              </p>

            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl px-5 py-3 text-right">

              <p className="text-sm text-text-secondary">
                🔥 Best Month
              </p>

              <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {bestMonth.month}
              </h2>

              <p className="text-sm text-text-secondary">
                ${bestMonth.revenue.toFixed(2)}
              </p>

            </div>

          </div>

          <div className="text-right mt-6">

            <p className="text-sm text-text-secondary">
              Total
            </p>

            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ${totalRevenue.toFixed(2)}
            </h2>

          </div>

        </div>

      </div>

      <div style={{ width: "100%", height: 320 }}>

        <ResponsiveContainer>

          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >

            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "var(--text-secondary)",
                fontSize: 14,
                fontWeight: 600,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "var(--text-secondary)",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value).toFixed(2)}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: 16,
                border: "1px solid var(--border)",
                boxShadow: "0 15px 40px rgba(0,0,0,.25)",
                background: "var(--surface)",
                color: "var(--text-primary)",
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={5}
              animationDuration={1800}
              dot={{
                r: 5,
                stroke: "#2563eb",
                strokeWidth: 2,
                fill: "var(--background)",
              }}
              activeDot={{
                r: 9,
                fill: "var(--background)",
                stroke: "#10b981",
                strokeWidth: 3,
              }}
              style={{
                filter:
                  "drop-shadow(0px 0px 10px rgba(16,185,129,.45))",
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}