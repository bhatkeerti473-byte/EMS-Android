import React from 'react';
import { 
  FileText, User, Receipt, Clock, ReceiptText, Wallet, 
  Bell, Calendar, Clock4, Mail, Send, CheckCircle2,
  Settings2, Download, Printer, ArrowLeft, ArrowRight
} from 'lucide-react';

function Step4PaymentSummary({ bookingId, onBackToDashboard, onPrevious, onNext }) {
  const data = {
    bookingId: bookingId || "BK-2026-000145",
    clientId: "CL-00058",
    invoiceNo: "INV-2026-000145",
    status: "Pending"
  };

  const costs = [
    { id: 1, desc: "Venue Cost", amount: "1,50,000" },
    { id: 2, desc: "Decoration Cost", amount: "75,000" },
    { id: 3, desc: "Catering Cost", amount: "90,000" },
    { id: 4, desc: "Photography Cost", amount: "60,000" },
    { id: 5, desc: "DJ Cost", amount: "45,000" },
    { id: 6, desc: "Vehicle Cost", amount: "20,000" },
    { id: 7, desc: "Hotel Cost", amount: "45,000" },
  ];

  return (
    <div className="flex flex-col gap-6 relative pb-24 max-w-[1500px]">
      
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-[14px] mb-4">
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Dashboard</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Bookings</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={() => onPrevious(2)}>Booking Details</span>
          <span className="text-gray-400">›</span>
          <span className="font-black text-gray-900">Step 4 – Payment Summary</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Booking ID :</span>
            <span className="font-black text-orange-500">{data.bookingId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Client ID :</span>
            <span className="font-black text-blue-600">{data.clientId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Invoice No :</span>
            <span className="font-black text-green-600">{data.invoiceNo}</span>
          </div>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Booking ID</p>
            <h3 className="text-[16px] font-black text-red-500">{data.bookingId}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
            <User size={20} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Client ID</p>
            <h3 className="text-[16px] font-black text-blue-600">{data.clientId}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 border border-green-100">
            <Receipt size={20} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Invoice Number</p>
            <h3 className="text-[16px] font-black text-green-600">{data.invoiceNo}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-2">Booking Status</p>
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[11px] font-black rounded border border-orange-200">
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Column 1: Cost Summary */}
        <div className="bg-[#fcfaf8] rounded-xl border border-gray-100 p-6 flex flex-col h-full shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <ReceiptText size={16} />
            </div>
            <h3 className="text-[16px] font-black text-gray-900">Cost Summary</h3>
          </div>
          
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-gray-500 font-bold border-b border-gray-200">
                <th className="pb-3 w-8">#</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {costs.map(cost => (
                <tr key={cost.id} className="text-gray-700 font-medium">
                  <td className="py-3 text-gray-500">{cost.id}</td>
                  <td className="py-3">{cost.desc}</td>
                  <td className="py-3 text-right">{cost.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 border-t border-gray-200 pt-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-[13px] font-bold text-gray-700">
              <span>Subtotal</span>
              <span>4,85,000</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-medium text-gray-600">
              <span className="flex items-center gap-4"><span className="text-gray-400 w-4">8</span> GST (18%)</span>
              <span>87,300</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-medium text-green-600">
              <span className="flex items-center gap-4"><span className="text-gray-400 w-4 text-gray-400">9</span> Discount</span>
              <span>-20,000</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-medium text-red-500">
              <span className="flex items-center gap-4"><span className="text-gray-400 w-4 text-gray-400">10</span> Late Fee</span>
              <span>5,000</span>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="bg-indigo-50/50 rounded-lg p-4 flex justify-between items-center border border-indigo-100">
              <span className="text-[14px] font-black text-gray-800">Grand Total</span>
              <span className="text-[18px] font-black text-indigo-900">₹ 5,57,300</span>
            </div>
          </div>
        </div>

        {/* Column 2: Payment Details */}
        <div className="bg-[#fcfaf8] rounded-xl border border-gray-100 p-6 flex flex-col h-full shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Wallet size={16} />
            </div>
            <h3 className="text-[16px] font-black text-gray-900">Payment Details</h3>
          </div>

          <div className="flex flex-col gap-8 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-600">Advance Paid</span>
              <span className="text-[15px] font-black text-green-600">₹ 1,50,000</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-600">Pending Amount</span>
              <span className="text-[15px] font-black text-red-500">₹ 4,07,300</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-600">Payment Method</span>
              <span className="text-[13px] font-bold text-gray-900">Bank Transfer</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-600">Transaction ID</span>
              <span className="text-[13px] font-bold text-gray-900">TRXN45871236</span>
            </div>

            <div className="border-t border-gray-200 border-dashed pt-8 pb-2 flex justify-between items-center mt-auto">
              <span className="text-[14px] font-black text-gray-800">Payment Status</span>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-[11px] font-black rounded border border-yellow-200">
                Partially Paid
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '26.92%' }}></div>
              </div>
              <span className="text-[12px] font-bold text-green-600">26.92% Paid</span>
            </div>
          </div>
        </div>

        {/* Column 3: Pending Payment Reminder */}
        <div className="bg-[#fcfaf8] rounded-xl border border-gray-100 p-6 flex flex-col h-full shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center">
              <Bell size={16} />
            </div>
            <h3 className="text-[16px] font-black text-gray-900">Pending Payment Reminder</h3>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            <div className="flex justify-between items-center pb-2">
              <span className="text-[13px] font-bold text-gray-600">Pending Amount</span>
              <span className="text-[16px] font-black text-red-500">₹ 4,07,300</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-600 flex items-center gap-2"><Calendar size={16}/> Due Date</span>
              <span className="text-[13px] font-bold text-gray-900">25 July 2026</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-600 flex items-center gap-2"><Clock4 size={16}/> Remaining Days</span>
              <span className="text-[13px] font-bold text-orange-500">7 Days</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-600 flex items-center gap-2"><Mail size={16}/> Reminder Count</span>
              <span className="text-[13px] font-bold text-gray-900">2</span>
            </div>

            <div className="mt-auto pt-6">
              <div className="bg-orange-50 rounded p-3 border border-orange-100 mb-6">
                <p className="text-[11px] font-medium text-gray-600 text-center">
                  Last reminder sent on 16 July 2026 via Email.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-2 border border-orange-500 text-orange-500 rounded-lg text-[13px] font-bold hover:bg-orange-50 transition-colors bg-white">
                  <Send size={16} />
                  Send Reminder
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-2 bg-orange-500 text-white rounded-lg text-[13px] font-bold hover:bg-orange-600 transition-colors">
                  <CheckCircle2 size={16} />
                  Mark Paid
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Payment History Section */}
      <div className="bg-[#fcfaf8] rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-[16px] font-black text-gray-900 mb-6">Payment History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 px-4 font-bold text-gray-500 text-[12px]">Payment ID</th>
                <th className="pb-3 px-4 font-bold text-gray-500 text-[12px]">Payment Date</th>
                <th className="pb-3 px-4 font-bold text-gray-500 text-[12px]">Payment Type</th>
                <th className="pb-3 px-4 font-bold text-gray-500 text-[12px]">Amount</th>
                <th className="pb-3 px-4 font-bold text-gray-500 text-[12px]">Payment Method</th>
                <th className="pb-3 px-4 font-bold text-gray-500 text-[12px]">Transaction ID</th>
                <th className="pb-3 px-4 font-bold text-gray-500 text-[12px] text-center">Status</th>
                <th className="pb-3 px-4 font-bold text-gray-500 text-[12px]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-[13px] font-bold text-gray-900">PAY-001</td>
                <td className="py-4 px-4 text-[13px] font-semibold text-gray-600">15 Apr 2024</td>
                <td className="py-4 px-4 text-[13px] font-semibold text-gray-600">Advance Payment</td>
                <td className="py-4 px-4 text-[13px] font-black text-gray-900">₹ 34,500</td>
                <td className="py-4 px-4 text-[13px] font-semibold text-gray-600">Bank Transfer</td>
                <td className="py-4 px-4 text-[13px] font-bold text-gray-900">TRX1234567890</td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 text-[11px] font-bold rounded">Paid</span>
                </td>
                <td className="py-4 px-4 text-[13px] font-medium text-gray-500 truncate max-w-[200px]">Advance payment received</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-[13px] font-bold text-gray-900">PAY-002</td>
                <td className="py-4 px-4 text-[13px] font-semibold text-gray-400">-</td>
                <td className="py-4 px-4 text-[13px] font-semibold text-gray-600">Remaining Payment</td>
                <td className="py-4 px-4 text-[13px] font-black text-gray-900">₹ 80,500</td>
                <td className="py-4 px-4 text-[13px] font-semibold text-gray-400">-</td>
                <td className="py-4 px-4 text-[13px] font-semibold text-gray-400">-</td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-500 border border-orange-200 text-[11px] font-bold rounded">Pending</span>
                </td>
                <td className="py-4 px-4 text-[13px] font-medium text-red-500 truncate max-w-[200px]">Due before 7/31/2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Actions Section */}
      <div className="bg-[#fcfaf8] rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
            <Settings2 size={20} />
          </div>
          <div>
            <h3 className="text-[16px] font-black text-gray-900">Available Actions</h3>
            <p className="text-[12px] text-gray-500 font-medium">Generate invoice, download or print for this booking.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-red-200 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-500 flex items-center justify-center border border-red-100 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <div>
              <h4 className="text-[14px] font-black text-gray-900">Generate Invoice</h4>
              <p className="text-[12px] font-medium text-gray-500">Create new invoice</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-green-200 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-500 flex items-center justify-center border border-green-100 group-hover:bg-green-500 group-hover:text-white transition-colors">
              <Download size={20} />
            </div>
            <div>
              <h4 className="text-[14px] font-black text-gray-900">Download Invoice PDF</h4>
              <p className="text-[12px] font-medium text-gray-500">Download invoice as PDF</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Printer size={20} />
            </div>
            <div>
              <h4 className="text-[14px] font-black text-gray-900">Print Invoice</h4>
              <p className="text-[12px] font-medium text-gray-500">Print invoice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => onPrevious(3)}
          className="flex items-center gap-2 px-6 py-2.5 border border-orange-200 rounded-lg text-[13px] font-bold text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm"
        >
          Next
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}

export default Step4PaymentSummary;
