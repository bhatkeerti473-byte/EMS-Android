import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, PieChart as PieIcon, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

export default function FinanceDashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const summaryRes = await fetch("http://localhost:5000/api/finance/summary");
        const summaryData = await summaryRes.json();

        const plRes = await fetch("http://localhost:5000/api/finance/profit-loss");
        const plData = await plRes.json();

        if (summaryData.success) {
          setSummary(summaryData.summary);
        } else {
          setError(summaryData.message || "Failed to load finance summary");
        }

        if (plData.success) {
          setChartData(plData.report);
        }
      } catch (err) {
        console.error("Error fetching finance data:", err);
        setError("Network error fetching financial metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading financial metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm my-4">
        <p className="font-semibold">Error Loading Finance</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const { totalIncome = 0, totalExpense = 0, netBalance = 0, incomeSplit = [], expenseSplit = [] } = summary || {};
  const profitMargin = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

  // Colors for charts
  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Balance Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Net Balance</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-2">₹{netBalance.toLocaleString("en-IN")}</h3>
            </div>
            <div className={`p-3 rounded-lg ${netBalance >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {netBalance >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
            {netBalance >= 0 ? (
              <span className="text-green-600 font-bold flex items-center">
                <ArrowUpRight size={16} className="mr-0.5" /> Good Standing
              </span>
            ) : (
              <span className="text-red-600 font-bold flex items-center">
                <ArrowDownRight size={16} className="mr-0.5" /> Deficit
              </span>
            )}
            <span>Current net cash flow</span>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Income (Credit)</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-2">₹{totalIncome.toLocaleString("en-IN")}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <span className="text-green-600 font-bold mr-1">+{incomeSplit.length}</span> categories tracking inflow
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Expenses (Debit)</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-2">₹{totalExpense.toLocaleString("en-IN")}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <span className="text-red-600 font-bold mr-1">-{expenseSplit.length}</span> categories tracking outflow
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Net Profit Margin</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{profitMargin}%</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <PieIcon size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Ratio of net profit to total revenue
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue & Expense Trend</h3>
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-full">Monthly Aggregated</span>
          </div>
          <div className="h-[320px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <YAxis tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "12px", border: "none" }}
                    formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, undefined]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />
                  <Area type="monotone" name="Income" dataKey="income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" name="Expenses" dataKey="expense" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No monthly transactions recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Splits */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Income Category Split</h3>
            <div className="h-[220px] flex items-center justify-center relative">
              {incomeSplit.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={incomeSplit} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value">
                      {incomeSplit.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, undefined]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-400 text-sm">No Income data logged</div>
              )}
              {incomeSplit.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-400 font-bold uppercase">Revenue</span>
                  <span className="text-lg font-bold text-gray-800">₹{totalIncome.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Chart Legends */}
          <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto pr-1">
            {incomeSplit.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-gray-600 truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">₹{item.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Expenses Splits & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Expense Category Split</h3>
          <div className="h-[220px] flex items-center justify-center relative">
            {expenseSplit.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseSplit} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value">
                    {expenseSplit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, undefined]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 text-sm">No Expense data logged</div>
            )}
            {expenseSplit.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-400 font-bold uppercase">Spent</span>
                <span className="text-lg font-bold text-gray-800">₹{totalExpense.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2 max-h-[120px] overflow-y-auto pr-1">
            {expenseSplit.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[(idx + 2) % COLORS.length] }} />
                  <span className="text-gray-600 truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">₹{item.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Help & Accounting Rules */}
        <div className="lg:col-span-2 bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-2xl shadow-md p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xl font-bold">Double-Entry Ledger Guidance</h4>
            <p className="text-amber-100 text-sm leading-relaxed">
              Maintain clean book audits by logging all incoming cash/credit accounts (inflow) and outgoing vendor/rent accounts (outflow) through the Credit & Debit ledger. Client bookings processed via Razorpay/Card are synchronized automatically.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-amber-200 uppercase font-semibold">Crediting Account</p>
                <p className="text-lg font-bold mt-1">Inflow / Revenue</p>
                <p className="text-xs text-amber-100/70 mt-1">Increases balance asset status.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-amber-200 uppercase font-semibold">Debiting Account</p>
                <p className="text-lg font-bold mt-1">Outflow / Expense</p>
                <p className="text-xs text-amber-100/70 mt-1">Decreases overall balance assets.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-4 mt-6 text-xs text-amber-200 flex justify-between">
            <span>Accounting System Status: Operational</span>
            <span>Real-time client synchronization</span>
          </div>
        </div>
      </div>
    </div>
  );
}
