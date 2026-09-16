import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Printer, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

export default function ProfitLossReport() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dateFilter, setDateFilter] = useState("ytd"); // month, quarter, ytd, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchPLData = useCallback(async () => {
    try {
      setLoading(true);
      let queryParams = "";

      const today = new Date();
      let start = "";
      let end = today.toISOString().split("T")[0];

      if (dateFilter === "month") {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        start = firstDay.toISOString().split("T")[0];
      } else if (dateFilter === "quarter") {
        const currentMonth = today.getMonth();
        const startMonth = currentMonth - (currentMonth % 3);
        const firstDay = new Date(today.getFullYear(), startMonth, 1);
        start = firstDay.toISOString().split("T")[0];
      } else if (dateFilter === "ytd") {
        start = `${today.getFullYear()}-01-01`;
      } else if (dateFilter === "custom" && startDate && endDate) {
        start = startDate;
        end = endDate;
      }

      if (start && end) {
        queryParams = `?startDate=${start}&endDate=${end}`;
      }

      const res = await fetch(`http://localhost:5000/api/finance/summary${queryParams}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      } else {
        setError(data.message || "Failed to compile Profit & Loss data");
      }
    } catch (err) {
      console.error(err);
      setError("Network error fetching profit-and-loss metrics.");
    } finally {
      setLoading(false);
    }
  }, [dateFilter, startDate, endDate]);

  useEffect(() => {
    fetchPLData();
  }, [fetchPLData]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Compiling Profit & Loss statement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm my-4">
        <p className="font-semibold">Error Loading Profit & Loss Report</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const { totalIncome = 0, totalExpense = 0, netBalance = 0, categorySummary = {} } = summary || {};
  const isProfit = netBalance >= 0;

  // Split category totals into Income and Expense groupings
  const incomeItems = Object.keys(categorySummary)
    .filter((cat) => !["Venue Rent", "Staff Salaries", "Vendor Payout", "Equipment Purchase", "Maintenance", "Utilities", "Marketing", "Taxes", "Other Expense"].includes(cat))
    .map((cat) => ({ name: cat, value: categorySummary[cat] }));

  const expenseItems = Object.keys(categorySummary)
    .filter((cat) => ["Venue Rent", "Staff Salaries", "Vendor Payout", "Equipment Purchase", "Maintenance", "Utilities", "Marketing", "Taxes", "Other Expense"].includes(cat))
    .map((cat) => ({ name: cat, value: categorySummary[cat] }));

  return (
    <div className="space-y-6 animate-fadeIn print:bg-white print:p-8 print:text-black">
      {/* Date Range Selection & Actions Dashboard */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setDateFilter("month")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${dateFilter === "month" ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-slate-100"}`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateFilter("quarter")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${dateFilter === "quarter" ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-slate-100"}`}
          >
            This Quarter
          </button>
          <button
            onClick={() => setDateFilter("ytd")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${dateFilter === "ytd" ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-slate-100"}`}
          >
            Year-to-Date
          </button>
          <button
            onClick={() => setDateFilter("custom")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${dateFilter === "custom" ? "bg-slate-900 text-white" : "text-gray-500 hover:bg-slate-100"}`}
          >
            Custom Range
          </button>
        </div>

        {dateFilter === "custom" && (
          <div className="flex items-center space-x-2 text-sm border border-gray-200 p-2 rounded-xl">
            <input
              type="date"
              className="outline-none text-gray-700 bg-transparent font-medium"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              className="outline-none text-gray-700 bg-transparent font-medium"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              onClick={fetchPLData}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs"
            >
              Apply
            </button>
          </div>
        )}

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 border border-gray-200 hover:bg-slate-50 font-bold text-gray-600 px-4 py-2 rounded-xl text-sm"
        >
          <Printer size={16} />
          <span>Print Audit</span>
        </button>
      </div>

      {/* Formal P&L Sheet Layout */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8 space-y-8 max-w-4xl mx-auto">
        {/* Invoice Header details */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Profit & Loss Statement</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">EMS Accounting & Audit Sheet</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-900">Event Management System</p>
            <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        {/* Dynamic balance blocks */}
        <div className="grid grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-gray-100 text-center">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Gross Revenues</p>
            <p className="text-xl font-bold text-slate-900 mt-1">₹{totalIncome.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Operating Expenses</p>
            <p className="text-xl font-bold text-slate-900 mt-1">₹{totalExpense.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Net Operations Margin</p>
            <p className={`text-xl font-extrabold mt-1 flex items-center justify-center ${isProfit ? "text-green-600" : "text-red-600"}`}>
              ₹{netBalance.toLocaleString("en-IN")}
              {isProfit ? <TrendingUp size={16} className="ml-1" /> : <TrendingDown size={16} className="ml-1" />}
            </p>
          </div>
        </div>

        {/* Ledger Details */}
        <div className="space-y-6">
          {/* Revenue Details Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">1. Operating Revenue</h4>
            <div className="space-y-2.5">
              {incomeItems.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-700 ml-4">{item.name}</span>
                  <span className="text-gray-900">₹{item.value.toLocaleString("en-IN")}</span>
                </div>
              ))}
              {incomeItems.length === 0 && (
                <p className="text-xs text-gray-400 italic ml-4">No revenues posted in this cycle.</p>
              )}
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t border-gray-100 pt-3">
              <span className="text-gray-800">Total Operating Revenue</span>
              <span className="text-gray-900 underline">₹{totalIncome.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Operating Cost Details Section */}
          <div className="space-y-3 pt-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">2. Operating Expenses</h4>
            <div className="space-y-2.5">
              {expenseItems.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-700 ml-4">{item.name}</span>
                  <span className="text-gray-900">₹{item.value.toLocaleString("en-IN")}</span>
                </div>
              ))}
              {expenseItems.length === 0 && (
                <p className="text-xs text-gray-400 italic ml-4">No operational debits posted in this cycle.</p>
              )}
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t border-gray-100 pt-3">
              <span className="text-gray-800">Total Operating Expenses</span>
              <span className="text-gray-900 underline">₹{totalExpense.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Bottom margin analysis */}
          <div className={`p-4 rounded-xl border mt-8 ${isProfit ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100"}`}>
            <div className="flex justify-between items-center font-extrabold text-base">
              <span className="text-gray-800">Net Profit / (Loss)</span>
              <span className={isProfit ? "text-green-700" : "text-red-700"}>
                ₹{netBalance.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Signoff Footer */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-8 mt-12 text-xs text-gray-400 font-medium">
          <span>EMS Ledger Verification Stamp</span>
          <span>Approved Representative Sign-off: ________________</span>
        </div>
      </div>
    </div>
  );
}
