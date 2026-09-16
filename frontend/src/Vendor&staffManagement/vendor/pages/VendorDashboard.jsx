import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CircleCheckBig,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  ShieldCheck,
  FileText,
  UserCircle2,
} from "lucide-react";
import PremiumLogo from "../../../components/PremiumLogo/PremiumLogo";

const overviewCards = [
  { label: "Assigned Events", value: "4", helper: "Total Events", icon: CalendarDays, tone: "blue" },
  { label: "Pending Services", value: "2", helper: "Total Pending", icon: Package, tone: "green" },
  { label: "Completed Services", value: "8", helper: "Total Completed", icon: CircleCheckBig, tone: "violet" },
  { label: "Pending Payments", value: "₹25,000", helper: "Total Pending", icon: CreditCard, tone: "orange" },
];

const events = [
  { event: "Wedding Event", venue: "Grand Palace", date: "20 Jun 2025", status: "Upcoming" },
  { event: "Corporate Event", venue: "Taj Center", date: "22 Jun 2025", status: "Ongoing" },
  { event: "Birthday Party", venue: "Dream Land", date: "25 Jun 2025", status: "Upcoming" },
  { event: "Product Launch", venue: "Lotus Banquet", date: "05 Jul 2025", status: "Upcoming" },
];

const requests = [
  { service: "Catering", event: "Wedding Event", deadline: "20 Jun 2025", status: "Pending" },
  { service: "Decoration", event: "Birthday Party", deadline: "25 Jun 2025", status: "Completed" },
  { service: "Photography", event: "Corporate Event", deadline: "22 Jun 2025", status: "Pending" },
  { service: "Sound & Lighting", event: "Product Launch", deadline: "05 Jul 2025", status: "Pending" },
];

const contracts = [
  { id: "CT001", event: "Wedding Event", amount: "₹50,000", status: "Active" },
  { id: "CT002", event: "Corporate Event", amount: "₹30,000", status: "Completed" },
  { id: "CT003", event: "Birthday Party", amount: "₹15,000", status: "Pending" },
];

const payments = [
  { event: "Wedding Event", amount: "₹50,000", status: "Paid", date: "18 Jun 2025" },
  { event: "Corporate Event", amount: "₹30,000", status: "Pending", date: "-" },
  { event: "Product Launch", amount: "₹40,000", status: "Paid", date: "10 Jun 2025" },
];

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "assigned-events", label: "Assigned Events", icon: CalendarDays },
  { key: "service-requests", label: "Service Requests", icon: ReceiptText },
  { key: "contracts", label: "Contracts", icon: ShieldCheck },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "profile", label: "Profile", icon: UserCircle2 },
];

const eventSegments = [
  { label: "Upcoming (4)", value: 4, color: "#2563eb" },
  { label: "Ongoing (2)", value: 2, color: "#22c55e" },
  { label: "Completed (5)", value: 5, color: "#7c3aed" },
];

const paymentBars = [
  { month: "Jan", paid: 48, pending: 82 },
  { month: "Feb", paid: 36, pending: 68 },
  { month: "Mar", paid: 28, pending: 48 },
  { month: "Apr", paid: 34, pending: 54 },
  { month: "May", paid: 25, pending: 70 },
  { month: "Jun", paid: 72, pending: 31 },
];

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const totalSegments = eventSegments.reduce((sum, item) => sum + item.value, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const renderBadge = (status) => {
    if (status === "Paid" || status === "Active" || status === "Completed") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (status === "Ongoing") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-amber-100 text-amber-700";
  };

  const renderPage = () => {
    if (activePage === "assigned-events") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Assigned Events</h2>
              <p className="text-sm text-slate-500">Events currently assigned to your team</p>
            </div>
            <button type="button" className="text-sm font-semibold text-blue-600">
              View All
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {events.map((row) => (
                  <tr key={row.event}>
                    <td className="px-4 py-4 font-semibold text-slate-900">{row.event}</td>
                    <td className="px-4 py-4 text-slate-600">{row.venue}</td>
                    <td className="px-4 py-4 text-slate-600">{row.date}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${renderBadge(row.status)}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activePage === "service-requests") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Service Requests</h2>
              <p className="text-sm text-slate-500">Track vendor service requests</p>
            </div>
            <button type="button" className="text-sm font-semibold text-blue-600">
              View All
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {requests.map((request) => (
                  <tr key={`${request.service}-${request.event}`}>
                    <td className="px-4 py-4 font-semibold text-slate-900">{request.service}</td>
                    <td className="px-4 py-4 text-slate-600">{request.event}</td>
                    <td className="px-4 py-4 text-slate-600">{request.deadline}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${renderBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activePage === "contracts") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Contracts</h2>
              <p className="text-sm text-slate-500">Manage vendor contracts and billing</p>
            </div>
            <button type="button" className="text-sm font-semibold text-blue-600">
              View All
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Contract ID</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-4 py-4 font-semibold text-slate-900">{contract.id}</td>
                    <td className="px-4 py-4 text-slate-600">{contract.event}</td>
                    <td className="px-4 py-4 text-slate-600">{contract.amount}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${renderBadge(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activePage === "payments") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Payments</h2>
              <p className="text-sm text-slate-500">Payments received and pending</p>
            </div>
            <button type="button" className="text-sm font-semibold text-blue-600">
              View All
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Status</th>
                  <th className="px-4 py-3">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {payments.map((payment) => (
                  <tr key={`${payment.event}-${payment.amount}`}>
                    <td className="px-4 py-4 font-semibold text-slate-900">{payment.event}</td>
                    <td className="px-4 py-4 text-slate-600">{payment.amount}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${renderBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (activePage === "profile") {
      return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Profile</h2>
          <p className="mt-1 text-sm text-slate-500">Vendor profile details</p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">Raj Catering Services</p>
            <p className="text-sm text-slate-500">rajcatering@gmail.com</p>
            <p className="text-sm text-slate-500">9876543210</p>
          </div>
        </section>
      );
    }

    return (
      <>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            const tone =
              card.tone === "blue"
                ? "text-blue-600"
                : card.tone === "green"
                ? "text-emerald-600"
                : card.tone === "violet"
                ? "text-violet-600"
                : "text-orange-600";
            const bg =
              card.tone === "blue"
                ? "bg-blue-50"
                : card.tone === "green"
                ? "bg-emerald-50"
                : card.tone === "violet"
                ? "bg-violet-50"
                : "bg-orange-50";

            return (
              <article key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                    <p className="mt-3 text-4xl font-extrabold text-slate-950">{card.value}</p>
                    <p className="mt-2 text-sm text-slate-500">{card.helper}</p>
                  </div>
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl ${bg} ${tone}`}>
                    <Icon size={28} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Events Overview</h2>
            <p className="mt-1 text-sm text-slate-500">Current service status distribution</p>

            <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex items-center justify-center">
                <div
                  className="relative grid h-64 w-64 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(${eventSegments
                      .map((segment, index) => {
                        const start = eventSegments.slice(0, index).reduce((sum, item) => sum + item.value, 0);
                        const end = start + segment.value;
                        return `${segment.color} ${(start / totalSegments) * 100}% ${(end / totalSegments) * 100}%`;
                      })
                      .join(", ")})`,
                  }}
                >
                  <div className="grid h-36 w-36 place-items-center rounded-full bg-white shadow-sm">
                    <div className="text-center">
                      <p className="text-4xl font-extrabold text-slate-950">12</p>
                      <p className="text-sm text-slate-500">Total Events</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {eventSegments.map((segment) => (
                  <div key={segment.label} className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: segment.color }} />
                    <span className="w-28 text-sm text-slate-600">{segment.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Payments Overview <span className="text-slate-400">(This Month)</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">Paid vs pending payment trend</p>

            <div className="mt-6">
              <div className="flex h-72 items-end gap-4 border-b border-l border-slate-200 pl-8 pr-2 pt-4">
                {paymentBars.map((bar) => (
                  <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-56 items-end gap-2">
                      <div className="w-4 rounded-t bg-emerald-500" style={{ height: `${bar.paid * 2}px` }} />
                      <div className="w-4 rounded-t bg-orange-400" style={{ height: `${bar.pending * 2}px` }} />
                    </div>
                    <p className="text-sm font-semibold text-slate-600">{bar.month}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                  Paid
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-orange-400" />
                  Pending
                </span>
              </div>
            </div>
          </article>
        </section>

      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside
          className={`border-r border-slate-800 bg-[#08162e] text-white transition-all duration-300 ${
            sidebarOpen ? "lg:w-[280px]" : "lg:w-[88px]"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-5 py-5">
              <div className={`${sidebarOpen ? "block" : "hidden lg:block"} flex items-center gap-3`}>
                <PremiumLogo size="50px" />
                <div style={{ textAlign: "left" }}>
                  <p className="text-lg font-black uppercase tracking-[0.18em] golden-text-animate" style={{ margin: 0, lineHeight: 1.2 }}>Event</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] golden-text-animate" style={{ margin: 0, lineHeight: 1.2 }}>
                    Management System
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen((open) => !open)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/15"
                aria-label="Toggle sidebar"
              >
                <Menu size={18} />
              </button>
            </div>

            <div className="px-5 pb-6">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 p-0.5">
                    <div className="grid h-full w-full place-items-center rounded-full bg-slate-900 text-xl font-bold">
                      RC
                    </div>
                  </div>
                  <div className={`${sidebarOpen ? "block" : "hidden lg:block"}`}>
                    <p className="text-lg font-semibold">Raj Catering Services</p>
                    <p className="text-sm text-blue-100/75">Catering</p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-3 pb-4">
              <div className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActivePage(item.key)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-blue-100/80 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      {sidebarOpen && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="px-3 pb-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-left text-sm font-semibold text-orange-300 transition hover:bg-white/10"
              >
                <LogOut size={18} />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">Vendor Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Welcome back, Raj Catering Services! Here's an overview of your activities.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 md:flex md:items-center md:gap-2">
                  <CalendarDays size={16} className="text-blue-600" />
                  Monday, June 16, 2025
                </div>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Bell size={18} />
                </button>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-4 sm:p-6 lg:p-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
