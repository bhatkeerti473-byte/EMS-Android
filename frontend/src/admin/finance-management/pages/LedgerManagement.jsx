import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";

const INCOME_CATEGORIES = ["Event Booking", "Ticket Sales", "Sponsorship", "Consulting", "Other Income"];
const EXPENSE_CATEGORIES = ["Venue Rent", "Staff Salaries", "Vendor Payout", "Equipment Purchase", "Maintenance", "Utilities", "Marketing", "Taxes", "Other Expense"];

export default function LedgerManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Form states
  const [type, setType] = useState("credit"); // credit or debit
  const [category, setCategory] = useState(INCOME_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [status, setStatus] = useState("Completed");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/finance/transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        setError(data.message || "Failed to load transactions");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ledger entries from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setType("credit");
    setCategory(INCOME_CATEGORIES[0]);
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setPaymentMethod("Cash");
    setStatus("Completed");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    if (t.isSystemGenerated) {
      alert("System-generated transactions from online payments cannot be edited.");
      return;
    }
    setEditingTransaction(t);
    setType(t.type);
    setCategory(t.category);
    setAmount(t.amount);
    setDate(new Date(t.date).toISOString().split("T")[0]);
    setDescription(t.description || "");
    setPaymentMethod(t.paymentMethod || "Cash");
    setStatus(t.status || "Completed");
    setIsModalOpen(true);
  };

  // Adjust categories automatically when type toggles
  const handleTypeToggle = (newType) => {
    setType(newType);
    if (newType === "credit") {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    const payload = {
      type,
      category,
      amount: Number(amount),
      date: new Date(date),
      description,
      paymentMethod,
      status,
      recordedBy: localStorage.getItem("adminEmail") || "Admin",
    };

    try {
      let url = "http://localhost:5000/api/finance/transactions";
      let method = "POST";

      if (editingTransaction) {
        url = `http://localhost:5000/api/finance/transactions/${editingTransaction._id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        fetchTransactions();
      } else {
        alert(result.message || "Failed to save ledger entry.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving transaction.");
    }
  };

  const handleDelete = async (id, isSystemGenerated) => {
    if (isSystemGenerated) {
      alert("System-generated payments cannot be deleted.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this ledger entry?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/finance/transactions/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        fetchTransactions();
      } else {
        alert(result.message || "Failed to delete transaction.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting transaction.");
    }
  };

  const credits = transactions.filter((t) => t.type === "credit");
  const debits = transactions.filter((t) => t.type === "debit");

  const totalCreditAmount = credits.reduce((acc, t) => acc + t.amount, 0);
  const totalDebitAmount = debits.reduce((acc, t) => acc + t.amount, 0);
  const ledgerBalance = totalCreditAmount - totalDebitAmount;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading ledger records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm my-4">
        <p className="font-semibold">Error Loading Ledger</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Ledger Sheet Summary */}
      <div className="bg-slate-900 rounded-2xl text-white p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-r border-slate-700/50 pr-6 flex flex-col justify-center">
          <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Credit Inflow (CR)</p>
          <p className="text-2xl font-bold text-green-400 mt-1">₹{totalCreditAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="border-r border-slate-700/50 pr-6 flex flex-col justify-center">
          <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Debit Outflow (DR)</p>
          <p className="text-2xl font-bold text-red-400 mt-1">₹{totalDebitAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Net Cash Position</p>
            <p className={`text-3xl font-extrabold mt-1 ${ledgerBalance >= 0 ? "text-amber-400" : "text-red-400"}`}>
              ₹{ledgerBalance.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-md"
          >
            <Plus size={16} />
            <span>Post Entry</span>
          </button>
        </div>
      </div>

      {/* Double Entry Ledger Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Credits Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-md font-bold text-gray-800 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Credit Postings (Income)
            </h3>
            <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-1 rounded-full">
              {credits.length} Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-50">
                  <th className="py-2">Date</th>
                  <th className="py-2">Category</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {credits.slice(0, 8).map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-gray-500 whitespace-nowrap">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 font-semibold text-gray-700">
                      <div className="flex flex-col">
                        <span>{t.category}</span>
                        <span className="text-[11px] font-normal text-gray-400 max-w-[150px] truncate">{t.description || "No description"}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-green-600 whitespace-nowrap">₹{t.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 text-center">
                      {t.isSystemGenerated ? (
                        <span className="text-gray-400 text-xs font-medium italic">Auto</span>
                      ) : (
                        <div className="flex items-center justify-center space-x-1">
                          <button onClick={() => handleOpenEditModal(t)} className="p-1 text-gray-400 hover:text-amber-500 transition-colors">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(t._id, t.isSystemGenerated)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {credits.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">No credit logs listed.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Debits Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-md font-bold text-gray-800 flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2" /> Debit Postings (Expense)
            </h3>
            <span className="text-xs bg-red-50 text-red-700 font-bold px-2 py-1 rounded-full">
              {debits.length} Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-50">
                  <th className="py-2">Date</th>
                  <th className="py-2">Category</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {debits.slice(0, 8).map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-gray-500 whitespace-nowrap">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                    <td className="py-3 font-semibold text-gray-700">
                      <div className="flex flex-col">
                        <span>{t.category}</span>
                        <span className="text-[11px] font-normal text-gray-400 max-w-[150px] truncate">{t.description || "No description"}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-red-600 whitespace-nowrap">₹{t.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button onClick={() => handleOpenEditModal(t)} className="p-1 text-gray-400 hover:text-amber-500 transition-colors">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(t._id, t.isSystemGenerated)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {debits.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">No debit logs listed.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Posting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100 overflow-hidden transform transition-all">
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingTransaction ? "Edit Ledger Entry" : "Post Ledger Entry"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Entry Type</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTypeToggle("credit")}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${type === "credit" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    Credit (Inflow)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeToggle("debit")}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${type === "debit" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    Debit (Outflow)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transaction Amount (₹)</label>
                <input
                  required
                  type="number"
                  min="1"
                  step="any"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-semibold text-gray-900"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-medium"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {type === "credit"
                      ? INCOME_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)
                      : EXPENSE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Posting Date</label>
                  <input
                    required
                    type="date"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-medium"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Mode</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-medium"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Debit/Credit Card">Debit/Credit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Razorpay">Razorpay</option>
                    <option value="Other">Other Mode</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-medium"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Narrative/Description</label>
                <textarea
                  rows="3"
                  placeholder="Memo details e.g. supplier reference, staff stipend details..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-colors"
                >
                  {editingTransaction ? "Save Changes" : "Record Posting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
