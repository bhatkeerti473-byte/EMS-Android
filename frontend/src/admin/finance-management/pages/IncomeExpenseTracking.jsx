import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Activity, Percent, Loader2, Sparkles } from "lucide-react";

// Default monthly budgets for tracking operational costs
const DEFAULT_BUDGETS = {
  "Venue Rent": 200000,
  "Staff Salaries": 400000,
  "Vendor Payout": 300000,
  "Equipment Purchase": 150000,
  "Maintenance": 100000,
  "Utilities": 50000,
  "Marketing": 80000,
  "Taxes": 100000,
  "Other Expense": 50000,
};

export default function IncomeExpenseTracking() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/finance/summary");
        const data = await res.json();
        if (data.success) {
          setSummary(data.summary);
        } else {
          setError(data.message || "Failed to load summary stats");
        }
      } catch (err) {
        console.error(err);
        setError("Network error loading operational tracking.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading tracking profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        <p className="font-semibold">Error loading tracker data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const { totalIncome = 0, totalExpense = 0, incomeSplit = [], expenseSplit = [] } = summary || {};

  // Map category breakdown values
  const expenseMap = expenseSplit.reduce((acc, curr) => {
    acc[curr.name] = curr.value;
    return acc;
  }, {});

  // Calculate allocation percentages
  const totalBudgets = Object.values(DEFAULT_BUDGETS).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Visual Inflow vs Outflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Income Source Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-md font-bold text-gray-800">Operational Income Sources</h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time revenue distributions</p>
            </div>
            <span className="p-2 bg-green-50 text-green-600 rounded-lg">
              <ArrowUpRight size={20} />
            </span>
          </div>

          <div className="space-y-4">
            {incomeSplit.map((item) => {
              const pct = totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(1) : 0;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-700">{item.name}</span>
                    <span className="text-gray-500 font-medium">
                      ₹{item.value.toLocaleString("en-IN")} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {incomeSplit.length === 0 && (
              <p className="text-center py-6 text-sm text-gray-400">No income postings registered.</p>
            )}
          </div>
        </div>

        {/* Expense Allocations & Budgets */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-md font-bold text-gray-800">Expense Budget Tracking</h3>
              <p className="text-xs text-gray-400 mt-0.5">Monthly spending limits monitoring</p>
            </div>
            <span className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ArrowDownRight size={20} />
            </span>
          </div>

          <div className="space-y-4">
            {Object.keys(DEFAULT_BUDGETS).map((catName) => {
              const limit = DEFAULT_BUDGETS[catName];
              const actual = expenseMap[catName] || 0;
              const pct = Math.min((actual / limit) * 100, 100);
              const isOver = actual > limit;

              return (
                <div key={catName} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-700">{catName}</span>
                    <span className={`font-medium ${isOver ? "text-red-600 font-bold animate-pulse" : "text-gray-500"}`}>
                      ₹{actual.toLocaleString("en-IN")} / <span className="text-gray-400 text-xs font-normal">limit ₹{limit.toLocaleString("en-IN")}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOver ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-blue-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analytical Ratios & Health Meter */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-8 shadow-md">
        <h3 className="text-lg font-bold flex items-center mb-6">
          <Sparkles size={20} className="text-amber-400 mr-2" /> Financial Health Indicators
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Health Index Card */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-center mb-4">
              <Activity className="text-amber-400" size={32} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Expense-to-Income Ratio</p>
              <h4 className="text-3xl font-extrabold mt-2">
                {totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0}%
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Lower percentages indicate healthy asset-building liquidity. Target is &lt; 75%.
            </p>
          </div>

          {/* Budget Util Card */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-center mb-4">
              <Percent className="text-blue-400" size={32} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Budget Utilization</p>
              <h4 className="text-3xl font-extrabold mt-2">
                {((totalExpense / totalBudgets) * 100).toFixed(1)}%
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Actual spent of ₹{totalExpense.toLocaleString("en-IN")} vs total monthly allocation cap limit of ₹{totalBudgets.toLocaleString("en-IN")}.
            </p>
          </div>

          {/* Savings Index Card */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-center mb-4">
              <Percent className="text-green-400" size={32} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Surplus Savings Ratio</p>
              <h4 className="text-3xl font-extrabold mt-2">
                {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0}%
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Percentage of earnings retained. Higher values support business scaling and buffer funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
