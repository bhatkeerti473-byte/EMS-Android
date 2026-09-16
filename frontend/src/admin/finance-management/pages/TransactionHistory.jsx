import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight, RefreshCw, Loader2 } from "lucide-react";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState(""); // "" (All), "credit", "debit"
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      let queryParams = [];
      if (type) queryParams.push(`type=${type}`);
      if (category) queryParams.push(`category=${category}`);
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      if (search) queryParams.push(`search=${encodeURIComponent(search)}`);

      const queryStr = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      const res = await fetch(`http://localhost:5000/api/finance/transactions${queryStr}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setCurrentPage(1); // Reset page on filter refresh
      } else {
        setError(data.message || "Failed to load history audit log");
      }
    } catch (err) {
      console.error(err);
      setError("Network error loading transactional history.");
    } finally {
      setLoading(false);
    }
  }, [type, category, startDate, endDate, search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch("");
    setType("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    // triggers refresh via useEffect dependencies except search, so trigger manually
    setTimeout(() => fetchTransactions(), 50);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ["Date", "Type", "Category", "Amount (INR)", "Payment Mode", "Status", "Narrative/Description", "Recorded By", "Source"];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString("en-IN"),
      t.type.toUpperCase(),
      t.category,
      t.amount,
      t.paymentMethod || "Cash",
      t.status || "Completed",
      (t.description || "").replace(/"/g, '""'),
      t.recordedBy || "Admin",
      t.isSystemGenerated ? "System Automatic Sync" : "Manual Post",
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `EMS_Financial_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const allCategories = [
    "Event Booking", "Ticket Sales", "Sponsorship", "Consulting", "Other Income",
    "Venue Rent", "Staff Salaries", "Vendor Payout", "Equipment Purchase",
    "Maintenance", "Utilities", "Marketing", "Taxes", "Other Expense"
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <p className="font-semibold">Error Loading Transactions</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
      {/* Filtering Card Panel */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-4">
          {/* Text Search */}
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search narrative, references or logs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="submit"
              className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl transition-colors shrink-0"
              title="Reset Filters"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </form>

        {/* Structured Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
          {/* Flow Type */}
          <div>
            <label className="block text-gray-400 uppercase mb-1">Flow Type</label>
            <select
              className="w-full rounded-lg border border-gray-200 p-2.5 outline-none focus:border-amber-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Flow Types</option>
              <option value="credit">Credit (Inflow)</option>
              <option value="debit">Debit (Outflow)</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-400 uppercase mb-1">Category</label>
            <select
              className="w-full rounded-lg border border-gray-200 p-2.5 outline-none focus:border-amber-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-gray-400 uppercase mb-1">From Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 p-2 outline-none focus:border-amber-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-400 uppercase mb-1">To Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 p-2 outline-none focus:border-amber-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Audit Log Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-md font-bold text-gray-800 flex items-center">
            <Filter size={16} className="text-amber-500 mr-2" /> Audit Trail History
          </h3>
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-amber-500 mb-2" size={32} />
            <p className="text-gray-400 text-sm">Querying database registers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold">Method</th>
                  <th className="px-6 py-3 font-semibold text-right">Amount</th>
                  <th className="px-6 py-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          t.type === "credit" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {t.type === "credit" ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                        {t.type === "credit" ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">{t.category}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={t.description}>
                      {t.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-medium">{t.paymentMethod || "Cash"}</td>
                    <td
                      className={`px-6 py-4 text-right font-extrabold whitespace-nowrap ${
                        t.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                          t.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : t.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t.status || "Completed"}
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400">
                      No records matched the selected query search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, transactions.length)} of {transactions.length} entries
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => c - 1)}
                className="px-3 py-1 text-xs border border-gray-200 rounded-md font-semibold text-gray-500 hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 text-xs rounded-md font-bold ${
                    currentPage === idx + 1 ? "bg-slate-900 text-white" : "border border-gray-200 text-gray-500 hover:bg-slate-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => c + 1)}
                className="px-3 py-1 text-xs border border-gray-200 rounded-md font-semibold text-gray-500 hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
