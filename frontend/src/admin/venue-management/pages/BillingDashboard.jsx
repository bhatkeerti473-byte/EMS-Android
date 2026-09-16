import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, FileClock, IndianRupee, ReceiptText } from "lucide-react";

import { getBillingDashboard, getInvoicePdfUrl } from "../../../user-dashboard/services/userApi";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const toneClasses = {
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  blue: "text-blue-500",
  violet: "text-violet-500",
};

export default function BillingDashboard() {
  const [billing, setBilling] = useState({
    summary: {},
    invoices: [],
    payments: [],
    dailyTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBilling = () => {
      setIsLoading(true);
      getBillingDashboard()
        .then(setBilling)
        .catch(() => setBilling({ summary: {}, invoices: [], payments: [], dailyTransactions: [] }))
        .finally(() => setIsLoading(false));
    };

    loadBilling();
    window.addEventListener("focus", loadBilling);
    const intervalId = window.setInterval(loadBilling, 30000);

    return () => {
      window.removeEventListener("focus", loadBilling);
      window.clearInterval(intervalId);
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Total Revenue",
        value: formatINR(billing.summary.totalRevenue),
        icon: IndianRupee,
        tone: "emerald",
      },
      {
        label: "Pending Payments",
        value: formatINR(billing.summary.pendingAmount),
        icon: FileClock,
        tone: "amber",
      },
      {
        label: "Paid Invoices",
        value: billing.summary.paidInvoiceCount || 0,
        icon: ReceiptText,
        tone: "blue",
      },
      {
        label: "Daily Transactions",
        value: billing.summary.dailyTransactionCount || 0,
        icon: CreditCard,
        tone: "violet",
      },
    ],
    [billing.summary]
  );

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">Loading billing dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-extrabold text-slate-900">Billing Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Track invoices, GST totals, receipts, and payment settlements.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                <Icon className={toneClasses[card.tone]} size={22} />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-slate-900">{card.value}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-3 pr-4">Invoice</th>
                  <th className="py-3 pr-4">Client</th>
                  <th className="py-3 pr-4">Amount</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">PDF</th>
                </tr>
              </thead>
              <tbody>
                {billing.invoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b last:border-0">
                    <td className="py-4 pr-4 font-semibold text-blue-600">{invoice.invoiceNumber}</td>
                    <td className="py-4 pr-4 text-slate-700">
                      {invoice.clientName}
                      <p className="text-xs text-slate-400">{invoice.eventTitle}</p>
                    </td>
                    <td className="py-4 pr-4 font-semibold text-slate-900">{formatINR(invoice.totalAmount)}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${invoice.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                        onClick={() => window.open(getInvoicePdfUrl(invoice._id), "_blank")}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <h3 className="text-lg font-semibold text-slate-900">Daily Transactions</h3>
          <div className="mt-4 space-y-3">
            {billing.dailyTransactions.length === 0 && <p className="text-sm text-slate-500">No transactions recorded today.</p>}
            {billing.dailyTransactions.map((transaction) => (
              <article key={transaction._id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{transaction.type}</p>
                  <span className="text-sm font-bold text-slate-700">{formatINR(transaction.amount)}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">{transaction.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
