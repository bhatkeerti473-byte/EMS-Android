import React from 'react';
import {
  MapPin, Flower2, Utensils, Camera, Music, Car, BedDouble, Users,
  ArrowLeft, ArrowRight
} from 'lucide-react';

function Step2VenueServices({ bookingId, onBackToDashboard, onPrevious, onNext }) {
  const data = {
    bookingId: bookingId || "BK-2026-000145",
    clientId: "CL-00058",
    status: "Pending",
    financials: {
      total: "₹ 5,10,000",
      advance: "₹ 1,50,000",
      remaining: "₹ 3,60,000"
    }
  };

  const ServiceRow = ({ icon: Icon, title, image, colorClass, bgClass, cost, children }) => (
    <div className="flex flex-col xl:flex-row bg-white rounded-xl shadow-sm border border-gray-100 p-5 gap-6 items-start">

      {/* Icon & Title */}
      <div className="flex items-center gap-3 w-40 shrink-0 xl:pt-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgClass} ${colorClass}`}>
          <Icon size={20} />
        </div>
        <span className="font-black text-gray-900 text-[15px]">{title}</span>
      </div>

      {/* Image */}
      <div className="w-48 h-28 rounded-lg overflow-hidden shrink-0 border border-gray-100 hidden sm:block">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Details (Children) */}
      <div className="flex-1 w-full text-[13px] text-gray-800">
        {children}
      </div>

      {/* Cost */}
      <div className="shrink-0 w-32 xl:border-l xl:border-gray-100 xl:pl-6 xl:pt-2 text-right xl:text-left flex flex-row xl:flex-col items-center justify-between xl:items-start xl:justify-start w-full xl:w-auto mt-4 xl:mt-0 pt-4 xl:pt-0 border-t border-gray-100 xl:border-t-0">
        <span className="text-[12px] font-bold text-gray-500 mb-1 block">Cost</span>
        <span className="text-[18px] font-black text-blue-600">{cost}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 relative pb-24 max-w-[1400px]">

      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-[14px] mb-4">
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Dashboard</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Bookings</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onPrevious}>Booking Details</span>
          <span className="text-gray-400">›</span>
          <span className="font-black text-gray-900">Step 2 – Venue & Services</span>
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
            <span className="font-bold text-gray-500">Booking Status :</span>
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[11px] font-black rounded border border-orange-200">
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Overview Row */}
      <div className="bg-[#fcfaf8] rounded-xl border border-gray-100 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-[16px] font-black text-gray-900">Selected Venue & Services Overview</h3>
          <p className="text-[13px] text-gray-500 mt-1">Review all services selected for this booking.</p>
        </div>

        <div className="flex items-center gap-8 md:gap-12 flex-wrap">
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Total Estimated Cost</p>
            <h3 className="text-[22px] font-black text-blue-600">{data.financials.total}</h3>
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Advance Paid</p>
            <h3 className="text-[22px] font-black text-green-600">{data.financials.advance}</h3>
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Remaining Amount</p>
            <h3 className="text-[22px] font-black text-orange-500">{data.financials.remaining}</h3>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="flex flex-col gap-4">

        <ServiceRow
          icon={MapPin} title="Venue" cost="₹ 1,50,000"
          colorClass="text-blue-500" bgClass="bg-blue-50"
          image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?fit=crop&w=400&h=250"
        >
          <div className="grid grid-cols-[100px_auto] md:grid-cols-[100px_auto_100px_auto] gap-x-4 gap-y-3 pt-1">
            <div className="font-bold text-gray-500">Venue Name</div><div className="font-semibold">: Royal Grand Palace</div>
            <div className="font-bold text-gray-500">AC / Non AC</div><div className="font-semibold">: AC</div>
            <div className="font-bold text-gray-500">Hall Type</div><div className="font-semibold">: Banquet Hall</div>
            <div className="font-bold text-gray-500">Address</div><div className="font-semibold">: 123, Palace Road,<br />Bangalore, Karnataka - 560001</div>
            <div className="font-bold text-gray-500">Capacity</div><div className="font-semibold">: 500 Guests</div>
          </div>
        </ServiceRow>

        <ServiceRow
          icon={Flower2} title="Decoration" cost="₹ 75,000"
          colorClass="text-pink-500" bgClass="bg-pink-50"
          image="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?fit=crop&w=400&h=250"
        >
          <div className="grid grid-cols-[100px_auto] gap-x-4 gap-y-3 pt-1">
            <div className="font-bold text-gray-500">Package</div><div className="font-semibold">: Premium</div>
            <div className="font-bold text-gray-500">Flower Type</div><div className="font-semibold">: Roses & Lilies</div>
            <div className="font-bold text-gray-500">Theme</div><div className="font-semibold">: Royal Theme</div>
          </div>
        </ServiceRow>

        <ServiceRow
          icon={Utensils} title="Catering" cost="₹ 90,000"
          colorClass="text-green-500" bgClass="bg-green-50"
          image="https://images.unsplash.com/photo-1555244162-803834f70033?fit=crop&w=400&h=250"
        >
          <div className="grid grid-cols-[100px_auto] gap-x-4 gap-y-3 pt-1">
            <div className="font-bold text-gray-500">Type</div><div className="font-semibold">: Both (Veg & Non Veg)</div>
            <div className="font-bold text-gray-500">Menu</div><div className="font-semibold">: Starter, Soup, Main Course,<br />&nbsp;&nbsp;Dessert, Drinks</div>
            <div className="font-bold text-gray-500">Plate Count</div><div className="font-semibold">: 300 Plates</div>
          </div>
        </ServiceRow>

        <ServiceRow
          icon={Camera} title="Photography" cost="₹ 60,000"
          colorClass="text-purple-500" bgClass="bg-purple-50"
          image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?fit=crop&w=400&h=250"
        >
          <div className="grid grid-cols-[100px_auto] gap-x-4 gap-y-3 pt-1">
            <div className="font-bold text-gray-500">Studio Name</div><div className="font-semibold">: Capture Life Studio</div>
            <div className="font-bold text-gray-500">Photographer</div><div className="font-semibold">: Rahul Sharma</div>
            <div className="font-bold text-gray-500">Package</div><div className="font-semibold">: Premium Wedding Package</div>
          </div>
        </ServiceRow>

        <ServiceRow
          icon={Music} title="DJ" cost="₹ 45,000"
          colorClass="text-orange-500" bgClass="bg-orange-50"
          image="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?fit=crop&w=400&h=250"
        >
          <div className="grid grid-cols-[100px_auto] md:grid-cols-[100px_auto_120px_auto] gap-x-4 gap-y-3 pt-1">
            <div className="font-bold text-gray-500">Package</div><div className="font-semibold">: Premium DJ Package</div><div className="font-bold text-gray-500 hidden md:block"></div><div className="hidden md:block"></div>
            <div className="font-bold text-gray-500">Speakers</div><div className="font-semibold">: 8 JBL Speakers</div>
            <div className="font-bold text-gray-500">Smoke Machine</div><div className="font-semibold">: Yes</div>
            <div className="font-bold text-gray-500">Lighting</div><div className="font-semibold">: LED Moving Lights</div>
            <div className="font-bold text-gray-500">Generator</div><div className="font-semibold">: 62.5 KVA Silent</div>
          </div>
        </ServiceRow>

        <ServiceRow
          icon={Car} title="Vehicle" cost="₹ 20,000"
          colorClass="text-blue-500" bgClass="bg-blue-50"
          image="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?fit=crop&w=400&h=250"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px] rounded-tl-lg rounded-bl-lg">Vehicle</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px]">Vehicle Type</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px]">Driver</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px]">Capacity</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px] rounded-tr-lg rounded-br-lg text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-3 py-2 font-semibold">Toyota Innova Crysta</td>
                  <td className="px-3 py-2 font-medium text-gray-600">Car</td>
                  <td className="px-3 py-2 font-medium text-gray-600">Yes</td>
                  <td className="px-3 py-2 font-medium text-gray-600">7 Seater</td>
                  <td className="px-3 py-2 font-semibold text-right">₹ 5,000</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold">Tata Luxury Bus</td>
                  <td className="px-3 py-2 font-medium text-gray-600">Bus</td>
                  <td className="px-3 py-2 font-medium text-gray-600">Yes</td>
                  <td className="px-3 py-2 font-medium text-gray-600">35 Seater</td>
                  <td className="px-3 py-2 font-semibold text-right">₹ 15,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ServiceRow>

        <ServiceRow
          icon={BedDouble} title="Guest Rooms" cost="₹ 45,000"
          colorClass="text-orange-500" bgClass="bg-orange-50"
          image="https://images.unsplash.com/photo-1566665797739-1674de7a421a?fit=crop&w=400&h=250"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px] rounded-tl-lg rounded-bl-lg">Hotel Name</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px]">Room Type</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px]">Room Count</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px]">Check In</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px]">Check Out</th>
                  <th className="px-3 py-2 font-bold text-gray-600 text-[11px] rounded-tr-lg rounded-br-lg text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-3 py-2 font-semibold">The Grand Hotel</td>
                  <td className="px-3 py-2 font-medium text-gray-600">Deluxe Room</td>
                  <td className="px-3 py-2 font-medium text-gray-600 text-center">10</td>
                  <td className="px-3 py-2 font-medium text-gray-600">25 Aug 2026</td>
                  <td className="px-3 py-2 font-medium text-gray-600">26 Aug 2026</td>
                  <td className="px-3 py-2 font-semibold text-right">₹ 25,000</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold">The Grand Hotel</td>
                  <td className="px-3 py-2 font-medium text-gray-600">Suite Room</td>
                  <td className="px-3 py-2 font-medium text-gray-600 text-center">5</td>
                  <td className="px-3 py-2 font-medium text-gray-600">25 Aug 2026</td>
                  <td className="px-3 py-2 font-medium text-gray-600">26 Aug 2026</td>
                  <td className="px-3 py-2 font-semibold text-right">₹ 20,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ServiceRow>

        <ServiceRow
          icon={Users} title="Seating Arrangement" cost="₹ 25,000"
          colorClass="text-teal-500" bgClass="bg-teal-50"
          image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?fit=crop&w=400&h=250"
        >
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-1 text-center">
            <div><p className="font-bold text-gray-500 text-[11px] mb-1">Stage</p><p className="font-semibold text-gray-800">Included</p></div>
            <div><p className="font-bold text-gray-500 text-[11px] mb-1">VIP Seating</p><p className="font-semibold text-gray-800">Included</p></div>
            <div><p className="font-bold text-gray-500 text-[11px] mb-1">Round Tables</p><p className="font-semibold text-gray-800">30 Tables</p></div>
            <div><p className="font-bold text-gray-500 text-[11px] mb-1">Row Seating</p><p className="font-semibold text-gray-800">200 Seats</p></div>
            <div><p className="font-bold text-gray-500 text-[11px] mb-1">Buffet Area</p><p className="font-semibold text-gray-800">1 Section</p></div>
            <div><p className="font-bold text-gray-500 text-[11px] mb-1">Dining Tables</p><p className="font-semibold text-gray-800">20 Tables</p></div>
          </div>
        </ServiceRow>

      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={onPrevious}
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

export default Step2VenueServices;
