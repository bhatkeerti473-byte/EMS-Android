import React, { useState } from "react";
import BookingDetails from "./BookingDetails";
import Step2VenueServices from "./Step2VenueServices";
import SeatingArrangements from "../../venue-management/pages/SeatingArrangements";
import Step3StaffVendor from "./Step3StaffVendor";
import Step4PaymentSummary from "./Step4PaymentSummary";
import Step5BookingTimeline from "./Step5BookingTimeline";
import Step6Approval from "./Step6Approval";
import BookingApprovedSuccess from "./BookingApprovedSuccess";
import { User, MapPin, Users, CreditCard, Clock, ShieldCheck, CheckCircle2, LayoutGrid, ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = [
  { id: 1, title: "Client & Event Details", icon: User },
  { id: 2, title: "Decoration & Services", icon: MapPin },
  { id: 3, title: "Seating Arrangement", icon: LayoutGrid },
  { id: 4, title: "Staff & Vendors", icon: Users },
  { id: 5, title: "Payment Summary", icon: CreditCard },
  { id: 6, title: "Timeline", icon: Clock },
  { id: 7, title: "Approval", icon: ShieldCheck },
  { id: 8, title: "Confirmation", icon: CheckCircle2 }
];

export default function BookingWorkflowContainer({ bookingId, onBack }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Top Stepper Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-[1500px] mx-auto overflow-x-auto custom-scrollbar py-1 gap-2">
          <div className="flex items-center gap-1.5 min-w-max">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.id;
              const isCompleted = currentStep > s.id;
              return (
                <React.Fragment key={s.id}>
                  <button
                    onClick={() => setCurrentStep(s.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 ring-2 ring-orange-500/30"
                        : isCompleted
                        ? "bg-orange-50 text-orange-600 hover:bg-orange-100/80 border border-orange-100"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isActive
                          ? "bg-white text-orange-600"
                          : isCompleted
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? "✓" : s.id}
                    </span>
                    <Icon size={14} />
                    <span>{s.title}</span>
                  </button>
                  {s.id < STEPS.length && (
                    <span className="text-gray-300 font-bold text-xs px-0.5">›</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200 shrink-0 ml-4 cursor-pointer"
          >
            Close Flow
          </button>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto w-full flex-1">
        {currentStep === 1 && (
          <BookingDetails
            bookingId={bookingId}
            onBack={onBack}
            onNext={() => handleNext()}
          />
        )}
        {currentStep === 2 && (
          <Step2VenueServices
            bookingId={bookingId}
            onBackToDashboard={onBack}
            onPrevious={() => handlePrevious()}
            onNext={() => handleNext()}
          />
        )}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4 relative pb-20">
            <SeatingArrangements />
            <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => handlePrevious()}
                className="flex items-center gap-2 px-6 py-2.5 border border-orange-200 rounded-lg text-[13px] font-bold text-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                Previous: Decoration & Services
              </button>
              
              <button 
                onClick={() => handleNext()}
                className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
              >
                Next: Staff & Vendors
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <Step3StaffVendor
            bookingId={bookingId}
            onBackToDashboard={onBack}
            onPrevious={() => handlePrevious()}
            onNext={() => handleNext()}
          />
        )}
        {currentStep === 5 && (
          <Step4PaymentSummary
            bookingId={bookingId}
            onBackToDashboard={onBack}
            onPrevious={() => handlePrevious()}
            onNext={() => handleNext()}
          />
        )}
        {currentStep === 6 && (
          <Step5BookingTimeline
            bookingId={bookingId}
            onBackToDashboard={onBack}
            onPrevious={() => handlePrevious()}
            onNext={() => handleNext()}
          />
        )}
        {currentStep === 7 && (
          <Step6Approval
            bookingId={bookingId}
            onBackToDashboard={onBack}
            onPrevious={() => handlePrevious()}
            onNext={() => handleNext()}
          />
        )}
        {currentStep === 8 && (
          <BookingApprovedSuccess
            bookingId={bookingId}
            onBack={() => handlePrevious()}
            onNext={onBack}
          />
        )}
      </div>
    </div>
  );
}
