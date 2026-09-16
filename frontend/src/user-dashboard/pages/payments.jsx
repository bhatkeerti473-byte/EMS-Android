import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, Download, FileText, ReceiptText, WalletCards, Clock, Calendar, ChevronLeft, ChevronRight, Copy, CheckCircle, Printer, Ticket, Info, X } from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import { getClientDisplayName, getCurrentClient } from "../services/clientSession";
import {
  createRazorpayOrder,
  getInvoicePdfUrl,
  getUserBilling,
  recordCashPayment,
  verifyRazorpayPayment,
} from "../services/userApi";
import "../styles/dashboard.css";
import "../../pages/styles/Invoice.css";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout"));
    document.body.appendChild(script);
  });

const getRazorpayMethodOptions = (paymentMethod) => {
  const selected = String(paymentMethod || "").toLowerCase();

  return {
    upi: selected === "upi",
    card: selected === "debit/credit card",
    netbanking: selected === "net banking",
    wallet: false,
    emi: false,
    paylater: false,
  };
};

const Payments = () => {
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);
  const userId =
    currentClient.id ||
    currentClient._id ||
    currentClient.userId ||
    currentClient.email ||
    currentClient.phone ||
    currentClient.phone_number ||
    "guest";
  const [billing, setBilling] = useState({ invoices: [], payments: [], transactions: [] });
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [isLoading, setIsLoading] = useState(true);
  const [activeInvoiceId, setActiveInvoiceId] = useState("");
  const [message, setMessage] = useState("");

  const loadBilling = useCallback(() => {
    setIsLoading(true);
    getUserBilling(userId)
      .then((data) => {
        setBilling({
          invoices: Array.isArray(data?.invoices) ? data.invoices : [],
          payments: Array.isArray(data?.payments) ? data.payments : [],
          transactions: Array.isArray(data?.transactions) ? data.transactions : [],
        });
      })
      .catch(() => setBilling({ invoices: [], payments: [], transactions: [] }))
      .finally(() => setIsLoading(false));
  }, [userId]);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  // Auto-refresh data when the user refocuses the dashboard window tab
  useEffect(() => {
    window.addEventListener("focus", loadBilling);
    return () => window.removeEventListener("focus", loadBilling);
  }, [loadBilling]);

  const totals = useMemo(() => {
    const primaryPaid = billing.invoices.reduce((sum, invoice) => sum + (Number(invoice.paidAmount) || 0), 0);
    const fallbackHistoryPaid = billing.payments.reduce((sum, p) => p.status === "Paid" || p.status === "Success" ? sum + Number(p.amount) : sum, 0);
    const paid = Math.max(primaryPaid, fallbackHistoryPaid);

    const pending = billing.invoices.reduce((sum, invoice) => {
      if (invoice.status === "Paid") return sum;
      return sum + Math.max(Number(invoice.totalAmount) - Number(invoice.paidAmount || 0), 0);
    }, 0);

    return {
      paid,
      pending,
      receipts: billing.payments.length || billing.invoices.filter((invoice) => invoice.receiptNumber || invoice.status === "Paid").length,
    };
  }, [billing.invoices, billing.payments]);

  const [viewPayment, setViewPayment] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [pendingPaymentInvoice, setPendingPaymentInvoice] = useState(null);
  const [customPayAmount, setCustomPayAmount] = useState("");

  const handleOnlinePayment = async (invoice) => {
    try {
      setActiveInvoiceId(invoice._id);
      setMessage("");
      await loadRazorpayCheckout();
      const { keyId, order } = await createRazorpayOrder(invoice._id, customPayAmount, selectedMethod);

      const checkout = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Event Management System",
        description: invoice.eventTitle || "Booking Deposit",
        order_id: order.id,
        prefill: {
          name: clientName,
          email: currentClient.email || invoice.clientEmail || "",
          contact: currentClient.phone || "",
        },
        method: getRazorpayMethodOptions(selectedMethod),
        notes: {
          invoiceId: invoice._id,
          paymentMethod: selectedMethod,
        },

        handler: async (response) => {
          try {
            const verificationResult = await verifyRazorpayPayment({
              invoiceId: invoice._id,
              method: selectedMethod,
              ...response,
            });

            setMessage("Payment successful! UI records synchronized.");

            // Instantly sync layout state matrices before background thread finishes polling
            if (verificationResult?.payment) {
              setBilling((prev) => ({
                ...prev,
                payments: [verificationResult.payment, ...prev.payments],
                invoices: prev.invoices.map((inv) =>
                  inv._id === invoice._id ? {
                    ...inv,
                    paidAmount: (inv.paidAmount || 0) + verificationResult.payment.amount,
                    status: (inv.paidAmount || 0) + verificationResult.payment.amount >= inv.totalAmount ? "Paid" : "Partially Paid"
                  } : inv
                ),
              }));
            }

            // Force server alignment check
            loadBilling();
          } catch (verifError) {
            setMessage("Payment verified on gateway, but failed dashboard population. Please refresh.");
            loadBilling();
          }
        },
        theme: {
          color: "#0f766e",
        },
      });

      checkout.open();
    } catch (error) {
      setMessage(error.message || "Payment could not be started.");
    } finally {
      setActiveInvoiceId("");
    }
  };

  const handleCashPayment = async (invoice) => {
    try {
      setActiveInvoiceId(invoice._id);
      const cashResult = await recordCashPayment(invoice._id, "Cash payment recorded from client dashboard", customPayAmount);
      setMessage("Cash payment recorded successfully.");

      if (cashResult?.payment) {
        setBilling((prev) => ({
          ...prev,
          payments: [cashResult.payment, ...prev.payments],
          invoices: prev.invoices.map((inv) =>
            inv._id === invoice._id ? {
              ...inv,
              paidAmount: (inv.paidAmount || 0) + cashResult.payment.amount,
              status: (inv.paidAmount || 0) + cashResult.payment.amount >= inv.totalAmount ? "Paid" : "Partially Paid"
            } : inv
          ),
        }));
      }
      loadBilling();
    } catch (error) {
      setMessage(error.message || "Unable to record cash payment.");
    } finally {
      setActiveInvoiceId("");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content client-module-content" style={{ padding: '24px' }}>
        {message && <p className="profile-save-message" style={{ marginBottom: '16px' }}>{message}</p>}

        {/* --- Top Panel: Payments & Billing Overview --- */}
        <section className="billing-overview-panel">
          <div className="billing-overview-header">
            <span className="icon-wrap"><WalletCards size={20} /></span>
            <h2>Payments & Billing Overview</h2>
          </div>
          <div className="billing-overview-client-info">
            <div>
              <label>Client Name</label>
              <strong>{clientName}</strong>
            </div>
            <div>
              <label>Contact Information</label>
              <strong>{currentClient.email || currentClient.phone || "Not added"}</strong>
            </div>
            <div>
              <label>Invoices Issued</label>
              <strong>{billing.invoices.length}</strong>
            </div>
            <div>
              <label>Booking Date</label>
              <strong>
                {billing.invoices[0]?.createdAt
                  ? new Date(billing.invoices[0].createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </strong>
            </div>
            <div>
              <label>Total Amount</label>
              <strong>{formatINR(billing.invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0))}</strong>
            </div>
          </div>

          <div className="billing-overview-stats">
            <div className="billing-stat-box">
              <div className="billing-stat-icon green"><WalletCards size={24} /></div>
              <div className="billing-stat-copy">
                <h3>{formatINR(totals.paid)}</h3>
                <p>Amount Paid</p>
                <span>Completed payments</span>
              </div>
            </div>
            <div className="billing-stat-box">
              <div className="billing-stat-icon orange"><CreditCard size={24} /></div>
              <div className="billing-stat-copy">
                <h3>{formatINR(totals.pending)}</h3>
                <p>Remaining Balance</p>
                <span>Pending settlement</span>
              </div>
            </div>
            <div className="billing-stat-box">
              <div className="billing-stat-icon blue"><ReceiptText size={24} /></div>
              <div className="billing-stat-copy">
                <h3>{String(totals.receipts).padStart(2, '0')}</h3>
                <p>Receipts</p>
                <span>Generated after payment</span>
              </div>
            </div>
            <div className="billing-stat-box">
              <div className="billing-stat-icon purple"><Calendar size={24} /></div>
              <div className="billing-stat-copy">
                <h3>
                  {billing.invoices.find(inv => inv.status !== 'Paid')?.dueDate
                    ? new Date(billing.invoices.find(inv => inv.status !== 'Paid').dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : "On Event"}
                </h3>
                <p>Next Due Date</p>
                <span>Payment due date</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- Invoices Section --- */}
        <section className="modern-table-panel">
          <div className="modern-table-header-bar">
            <h2>
              <span className="icon-wrap" style={{ color: '#ea580c' }}><FileText size={20} /></span>
              Invoices
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label className="text-sm font-semibold text-slate-700">Payment Method Filter:</label>
              <select
                value={selectedMethod}
                onChange={(event) => setSelectedMethod(event.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#111827', fontSize: '14px', fontWeight: '500' }}
              >
                <option>UPI</option>
                <option>Debit/Credit Card</option>
                <option>Net Banking</option>
                <option>Cash</option>
              </select>
            </div>
          </div>

          <div className="modern-table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Invoice No.</th>
                  <th>Event / Venue</th>
                  <th>GST</th>
                  <th>Total Amount</th>
                  <th>Paid Amount</th>
                  <th>Remaining Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <tr><td colSpan="8" style={{ textAlign: 'center' }}>Loading invoices...</td></tr>}
                {!isLoading && billing.invoices.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center' }}>No invoices generated yet.</td></tr>}

                {billing.invoices.map((invoice) => {
                  const isPaid = invoice.status === "Paid" || invoice.paidAmount >= invoice.totalAmount;
                  const remaining = Math.max(Number(invoice.totalAmount) - Number(invoice.paidAmount || 0), 0);

                  return (
                    <tr key={invoice._id}>
                      <td>
                        <strong>{invoice.invoiceNumber || "INV-TEMP"}</strong><br />
                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                          {new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td>
                        <strong>{invoice.eventTitle || "Event"}</strong><br />
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{invoice.venueName || "Booking"}</span>
                      </td>
                      <td>
                        {formatINR(invoice.taxAmount)}<br />
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{invoice.taxRate || 18}% GST</span>
                      </td>
                      <td><strong>{formatINR(invoice.totalAmount)}</strong></td>
                      <td className="text-green-amount">{formatINR(invoice.paidAmount)}</td>
                      <td className="text-orange-amount">{formatINR(remaining)}</td>
                      <td>
                        <span className={`status-pill-modern ${isPaid ? 'success' : 'partial'}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        <div className="modern-action-stack">
                          <button
                            type="button"
                            className="action-pill-btn outline-green"
                            onClick={() => setViewInvoice(invoice)}
                          >
                            <FileText size={14} /> Payment Details
                          </button>

                          {!isPaid && selectedMethod === "Cash" && (
                            <button
                              type="button"
                              className="action-pill-btn outline-orange"
                              disabled={activeInvoiceId === invoice._id}
                              onClick={() => handleCashPayment(invoice)}
                            >
                              <Clock size={14} /> Record Cash
                            </button>
                          )}
                          {!isPaid && selectedMethod !== "Cash" && (
                            <button
                              type="button"
                              className="action-pill-btn outline-orange"
                              disabled={activeInvoiceId === invoice._id}
                              onClick={() => {
                                setPendingPaymentInvoice(invoice);
                                setCustomPayAmount(Math.max(Number(invoice.totalAmount) - Number(invoice.paidAmount || 0), 0));
                              }}
                            >
                              <Clock size={14} /> Pending Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="modern-table-footer">
            <span>Showing 1 of {Math.max(1, billing.invoices.length)} invoice{billing.invoices.length !== 1 ? 's' : ''}</span>

          </div>
        </section>

        {/* --- Payment History Section --- */}
        <section className="modern-table-panel">
          <div className="modern-table-header-bar">
            <h2>
              <span className="icon-wrap" style={{ color: '#ea580c' }}><ReceiptText size={20} /></span>
              Payment History
            </h2>
          </div>

          <div className="modern-table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Payment Date</th>
                  <th>Client Info</th>
                  <th>Amount Received</th>
                  <th>Payment Method</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {billing.payments.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center' }}>No transaction history found.</td></tr>}
                {billing.payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      <strong>PAY-{payment._id ? String(payment._id).slice(-8).toUpperCase() : "N/A"}</strong>
                    </td>
                    <td>
                      <strong>{new Date(payment.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong><br />
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{new Date(payment.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td>
                      <strong>{payment.bookingId?.clientName || payment.bookingId?.client_name || clientName || "Guest"}</strong><br />
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{payment.bookingId?.phone_number || currentClient.phone || "N/A"}</span>
                    </td>
                    <td className="text-green-amount">{formatINR(payment.amount)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                        <span style={{ color: '#2563eb' }}><WalletCards size={14} /></span> Razorpay
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{payment.method || payment.payment_method || "Online"}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="font-mono text-xs">{payment.razorpay_payment_id || payment.razorpayPaymentId || payment._id || "N/A"}</span>
                        <Copy size={12} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                      </div>
                    </td>
                    <td>
                      <span className="status-pill-modern success">Success</span>
                    </td>
                    <td>
                      <button className="action-pill-btn fill-grey" onClick={() => setViewPayment(payment)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- Payment Summary Footer --- */}
        <section className="payment-summary-panel">
          <div className="payment-summary-header">
            <span style={{ color: '#ea580c' }}><WalletCards size={20} /></span> Payment Summary
          </div>
          <div className="payment-summary-content">
            <div className="payment-summary-cols">
              <div>
                <label>Total Amount</label>
                <strong>{formatINR(billing.invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0))}</strong>
              </div>
              <div>
                <label>Total Paid</label>
                <strong className="text-green-amount">{formatINR(totals.paid)}</strong>
              </div>
              <div>
                <label>Remaining Balance</label>
                <strong className="text-orange-amount">{formatINR(totals.pending)}</strong>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Next Due Date</label>
                <strong>
                  {billing.invoices.find(inv => inv.status !== 'Paid')?.dueDate
                    ? new Date(billing.invoices.find(inv => inv.status !== 'Paid').dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : "15 May 2024"}
                </strong>
              </div>
            </div>
            <button className="payment-summary-btn" onClick={() => {
              const pendingInvoice = billing.invoices.find(inv => inv.status !== 'Paid');
              if (pendingInvoice) {
                setPendingPaymentInvoice(pendingInvoice);
                setCustomPayAmount(Math.max(Number(pendingInvoice.totalAmount) - Number(pendingInvoice.paidAmount || 0), 0));
              }
            }}>
              <Clock size={16} /> Pending Payment
            </button>
          </div>
        </section>

      </main>

      {/* --- Pending Payment Confirmation Modal --- */}
      {pendingPaymentInvoice && (
        <div className="invoice-modal-overlay">
          <div className="invoice-modal-content">
            <div className="invoice-modal-header">
              <div className="invoice-header-titles">
                <div className="icon-wrapper">
                  <CreditCard size={20} color="#ea580c" />
                </div>
                <div>
                  <h2>Confirm Payment Details</h2>
                  <p>Process your next payment installment.</p>
                </div>
              </div>
              <button className="invoice-close-btn" onClick={() => setPendingPaymentInvoice(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="invoice-modal-body">
              <div className="invoice-document-wrapper">
                <div className="invoice-document">

                  {/* Brand & Meta */}
                  <div className="doc-brand-header">
                    <div className="doc-brand">
                      <div className="doc-logo">
                        <Ticket size={24} color="#ea580c" />
                      </div>
                      <div>
                        <h3>Event Manager</h3>
                        <p>We Plan, You Celebrate!</p>
                      </div>
                    </div>
                    <div className="doc-meta">
                      <div className="meta-row">
                        <span>Invoice No</span>
                        <strong>{pendingPaymentInvoice.invoiceNumber || "INV-TEMP"}</strong>
                      </div>
                      <div className="meta-row">
                        <span>Booking Ref</span>
                        <strong>{String(pendingPaymentInvoice.bookingId?._id || pendingPaymentInvoice.bookingId).slice(-8).toUpperCase()}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="doc-section">
                    <h4 className="doc-section-title">Event Details</h4>
                    <div className="doc-grid">
                      <div className="doc-grid-row">
                        <span>Event Type</span>
                        <strong>{pendingPaymentInvoice.eventTitle || "Event"}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Venue</span>
                        <strong>{pendingPaymentInvoice.venueName || "Venue"}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Location</span>
                        <strong>{pendingPaymentInvoice.bookingId?.location || pendingPaymentInvoice.bookingId?.address || "N/A"}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Event Date</span>
                        <strong>{pendingPaymentInvoice.eventDate || (pendingPaymentInvoice.bookingId?.event_date ? new Date(pendingPaymentInvoice.bookingId.event_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "TBD")}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Time</span>
                        <strong>{pendingPaymentInvoice.bookingId?.time_slot || "Full Day"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Client Details Section */}
                  <div className="doc-section">
                    <h4 className="doc-section-title">Client Details</h4>
                    <div className="doc-grid">
                      <div className="doc-grid-row">
                        <span>Name</span>
                        <strong>{clientName}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Phone</span>
                        <strong>{pendingPaymentInvoice.bookingId?.phone_number || "N/A"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Cost Summary Section */}
                  <div className="doc-section doc-cost-section">
                    <h4 className="doc-section-title">Cost Summary</h4>
                    <div className="doc-grid">
                      <div className="doc-grid-row">
                        <span>Base Amount</span>
                        <strong>{formatINR(pendingPaymentInvoice.baseAmount)}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>GST ({pendingPaymentInvoice.taxRate || 18}%)</span>
                        <strong>{formatINR(pendingPaymentInvoice.taxAmount)}</strong>
                      </div>
                      <div className="doc-grid-row highlight-advance">
                        <span>Total Amount</span>
                        <strong>{formatINR(pendingPaymentInvoice.totalAmount)}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Amount Paid</span>
                        <strong style={{ color: '#059669' }}>{formatINR(pendingPaymentInvoice.paidAmount)}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Remaining Balance</span>
                        <strong style={{ color: '#ea580c' }}>{formatINR(Math.max(Number(pendingPaymentInvoice.totalAmount) - Number(pendingPaymentInvoice.paidAmount || 0), 0))}</strong>
                      </div>
                      <div className="doc-grid-row" style={{ marginTop: '12px', borderTop: '2px dashed #cbd5e1', paddingTop: '12px', alignItems: 'center' }}>
                        <span style={{ color: '#0f172a', fontWeight: '800', fontSize: '18px' }}>Amount to Pay Now</span>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                          <span style={{ color: '#64748b', marginRight: '6px', fontWeight: 'bold' }}>₹</span>
                          <input
                            type="number"
                            value={customPayAmount}
                            onChange={(e) => setCustomPayAmount(e.target.value)}
                            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ea580c', fontWeight: 'bold', fontSize: '18px', width: '120px', textAlign: 'right' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="invoice-actions-footer">
              <button
                className="invoice-btn-outline"
                onClick={() => setPendingPaymentInvoice(null)}
                style={{ borderColor: '#cbd5e1', color: '#475569' }}
              >
                Close
              </button>
              <button
                className="invoice-btn-outline"
                onClick={() => {
                  handleOnlinePayment(pendingPaymentInvoice);
                  setPendingPaymentInvoice(null);
                }}
                disabled={activeInvoiceId === pendingPaymentInvoice._id}
                style={{ background: '#ea580c', color: 'white', borderColor: '#ea580c' }}
              >
                {activeInvoiceId === pendingPaymentInvoice._id ? "Processing..." : "Proceed to Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- View Invoice Modal --- */}
      {viewInvoice && (
        <div className="invoice-modal-overlay">
          <div className="invoice-modal-content">
            <div className="invoice-modal-header">
              <div className="invoice-header-titles">
                <div className="icon-wrapper">
                  <Download size={20} color="#ea580c" />
                </div>
                <div>
                  <h2>Download Payment Details</h2>
                  <p>Get a copy of your payment details.</p>
                </div>
              </div>
              <button className="invoice-close-btn" onClick={() => setViewInvoice(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="invoice-modal-body">
              <div className="invoice-document-wrapper">
                <div className="invoice-document">

                  {/* Brand & Meta */}
                  <div className="doc-brand-header">
                    <div className="doc-brand">
                      <div className="doc-logo">
                        <Ticket size={24} color="#ea580c" />
                      </div>
                      <div>
                        <h3>Event Manager</h3>
                        <p>We Plan, You Celebrate!</p>
                      </div>
                    </div>
                    <div className="doc-meta">
                      <div className="meta-row">
                        <span>Invoice No</span>
                        <strong>{viewInvoice.invoiceNumber || "INV-TEMP"}</strong>
                      </div>
                      <div className="meta-row">
                        <span>Booking Ref</span>
                        <strong>{String(viewInvoice.bookingId?._id || viewInvoice.bookingId).slice(-8).toUpperCase()}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="doc-section">
                    <h4 className="doc-section-title">Event Details</h4>
                    <div className="doc-grid">
                      <div className="doc-grid-row">
                        <span>Event Type</span>
                        <strong>{viewInvoice.eventTitle || "Event"}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Venue</span>
                        <strong>{viewInvoice.venueName || "Venue"}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Location</span>
                        <strong>{viewInvoice.bookingId?.location || viewInvoice.bookingId?.address || "N/A"}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Event Date</span>
                        <strong>{viewInvoice.eventDate || (viewInvoice.bookingId?.event_date ? new Date(viewInvoice.bookingId.event_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "TBD")}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Time</span>
                        <strong>{viewInvoice.bookingId?.time_slot || "Full Day"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Client Details Section */}
                  <div className="doc-section">
                    <h4 className="doc-section-title">Client Details</h4>
                    <div className="doc-grid">
                      <div className="doc-grid-row">
                        <span>Name</span>
                        <strong>{viewInvoice.clientName || viewInvoice.bookingId?.clientName || "Client"}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Phone</span>
                        <strong>{viewInvoice.bookingId?.phone_number || "N/A"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Services Selected Section */}
                  {(viewInvoice.bookingId?.catering_details || viewInvoice.bookingId?.staff_requirements) && (
                    <div className="doc-section">
                      <h4 className="doc-section-title">Services Selected</h4>
                      <ul className="doc-services-list">
                        {viewInvoice.bookingId.catering_details?.type && (
                          <li>• Catering: {viewInvoice.bookingId.catering_details.type}</li>
                        )}
                        {viewInvoice.bookingId.staff_requirements?.event_coordinator > 0 && (
                          <li>• Event Coordinators: {viewInvoice.bookingId.staff_requirements.event_coordinator}</li>
                        )}
                        {viewInvoice.bookingId.staff_requirements?.catering_staff > 0 && (
                          <li>• Catering Staff: {viewInvoice.bookingId.staff_requirements.catering_staff}</li>
                        )}
                        {viewInvoice.bookingId.staff_requirements?.cleaning_staff > 0 && (
                          <li>• Cleaning Staff: {viewInvoice.bookingId.staff_requirements.cleaning_staff}</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="doc-section doc-cost-section">
                    <h4 className="doc-section-title">Cost Summary</h4>
                    <div className="doc-grid">
                      <div className="doc-grid-row">
                        <span>Base Amount</span>
                        <strong>{formatINR(viewInvoice.baseAmount)}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>GST ({viewInvoice.taxRate || 18}%)</span>
                        <strong>{formatINR(viewInvoice.taxAmount)}</strong>
                      </div>
                      <div className="doc-grid-row highlight-advance">
                        <span>Total Amount</span>
                        <strong>{formatINR(viewInvoice.totalAmount)}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Amount Paid</span>
                        <strong style={{ color: '#059669' }}>{formatINR(viewInvoice.paidAmount)}</strong>
                      </div>
                      <div className="doc-grid-row">
                        <span>Remaining Balance</span>
                        <strong style={{ color: '#ea580c' }}>{formatINR(Math.max(Number(viewInvoice.totalAmount) - Number(viewInvoice.paidAmount || 0), 0))}</strong>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="invoice-actions-footer">
              <button className="invoice-btn-outline" onClick={() => window.open(getInvoicePdfUrl(viewInvoice._id), "_blank")}>
                <Download size={18} />
                Download PDF
              </button>
              <button className="invoice-btn-outline" onClick={() => window.print()}>
                <Printer size={18} />
                Print
              </button>
            </div>

            <div className="invoice-footer-note">
              <Info size={14} color="#64748b" />
              <span>This document contains your payment details and cost summary.</span>
            </div>

          </div>
        </div>
      )}

      {/* --- View Details Modal --- */}
      {viewPayment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Payment Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment ID (PID)</span>
                <strong>{viewPayment.razorpay_payment_id || viewPayment.razorpayPaymentId || viewPayment._id || "N/A"}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Name</span>
                <strong>{viewPayment.bookingId?.clientName || viewPayment.bookingId?.client_name || clientName || "Guest"}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Phone Number</span>
                <strong>{viewPayment.bookingId?.phone_number || currentClient.phone || "N/A"}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Amount</span>
                <strong style={{ color: '#059669' }}>{formatINR(viewPayment.amount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Method</span>
                <strong>{viewPayment.method || viewPayment.payment_method || "Online"}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Status</span>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>Success</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Event</span>
                <strong>{viewPayment.bookingId?.eventTitle || viewPayment.bookingId?.event_title || "N/A"}</strong>
              </div>
            </div>

            <button
              onClick={() => setViewPayment(null)}
              style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '24px', cursor: 'pointer', fontWeight: '600' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
