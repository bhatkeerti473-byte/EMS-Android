import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './BookingStepper.css';

// Steps imports
import Step1_ClientDetails from './steps/Step1_ClientDetails';
import Step2_EventLocation from './steps/Step2_EventLocation';
import Step3_EventDateGuests from './steps/Step3_EventDateGuests';
import Step4_VenueSelection from './steps/Step4_VenueSelection';
import Step5_PackageConfirm from './steps/Step5_PackageConfirm';
import Step6_CustomizeIncluded from './steps/Step6_CustomizeIncluded';
import Step7_AdditionalServices from './steps/Step7_AdditionalServices';
import Step8_BookingSummary from './steps/Step8_BookingSummary';
import Step9_Payment from './steps/Step9_Payment';

const STEPS = [
  "Client", "Location", "Date", "Venue", "Package", "Customize", "Add-ons", "Summary", "Payment"
];

const BookingStepper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.package || null;

  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    package: selectedPackage,
    client: {
      useProfileInfo: true,
      name: '',
      phone: '',
      email: '',
      bookingFor: 'Myself'
    },
    location: {
      city: '',
      useCurrentLocation: false
    },
    event: {
      type: selectedPackage?.eventType || '',
      date: '',
      guests: '',
      timeSlot: ''
    },
    venue: {
      selectedVenue: null, // Holds either EMS Venue or Own Venue data
      isOwnVenue: false,
    },
    customizations: {},
    additionalServices: [],
    pricing: {
      package: selectedPackage,
      baseTotal: Number(selectedPackage?.offerPrice || selectedPackage?.price || 0),
      addonsTotal: 0,
      discount: selectedPackage ? (Number(selectedPackage.originalPrice || selectedPackage.price || 0) - Number(selectedPackage.offerPrice || selectedPackage.price || 0)) : 0,
      finalTotal: Number(selectedPackage?.offerPrice || selectedPackage?.price || 0),
      advanceAmount: Number(selectedPackage?.offerPrice || selectedPackage?.price || 0) * 0.3,
    }
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const updateBookingData = (section, data) => {
    setBookingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step1_ClientDetails data={bookingData} updateData={(d) => updateBookingData('client', d)} nextStep={nextStep} />;
      case 1:
        return <Step2_EventLocation data={bookingData} updateData={(d) => updateBookingData('location', d)} nextStep={nextStep} prevStep={prevStep} />;
      case 2:
        return <Step3_EventDateGuests data={bookingData} updateData={(d) => updateBookingData('event', d)} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step4_VenueSelection data={bookingData} updateData={(d) => updateBookingData('venue', d)} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step5_PackageConfirm data={bookingData} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <Step6_CustomizeIncluded data={bookingData} updateData={(d) => updateBookingData('customizations', d)} nextStep={nextStep} prevStep={prevStep} />;
      case 6:
        return <Step7_AdditionalServices data={bookingData} updateData={(d) => setBookingData(p => ({...p, additionalServices: d}))} nextStep={nextStep} prevStep={prevStep} />;
      case 7:
        return <Step8_BookingSummary data={bookingData} nextStep={nextStep} prevStep={prevStep} setBookingData={setBookingData} />;
      case 8:
        return <Step9_Payment data={bookingData} prevStep={prevStep} navigate={navigate} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  // Map our 9 internal steps to the 8 UI steps requested by the user
  const uiSteps = [
    { label: 'Client', internalSteps: [0] },
    { label: 'Event', internalSteps: [2] },
    { label: 'Location', internalSteps: [1] },
    { label: 'Venue', internalSteps: [3] },
    { label: 'Package', internalSteps: [4] },
    { label: 'Services', internalSteps: [5, 6] },
    { label: 'Summary', internalSteps: [7] },
    { label: 'Payment', internalSteps: [8] }
  ];

  return (
    <div className="booking-stepper-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 8-Step Header as requested */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'white', padding: '30px 40px', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
        {uiSteps.map((step, index) => {
          // Determine status of this UI step based on current internal step
          const isCompleted = currentStep > Math.max(...step.internalSteps);
          const isCurrent = step.internalSteps.includes(currentStep);
          
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, position: 'relative' }}>
              
              {/* Connecting Line */}
              {index < uiSteps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '50%',
                  width: '100%',
                  height: '2px',
                  background: isCompleted ? '#ea580c' : '#e2e8f0',
                  zIndex: 0
                }} />
              )}

              {/* Step Circle */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCompleted ? '#ea580c' : isCurrent ? '#ea580c' : 'white',
                border: isCompleted || isCurrent ? '2px solid #ea580c' : '2px solid #cbd5e1',
                color: isCompleted || isCurrent ? 'white' : '#94a3b8',
                fontWeight: '800',
                fontSize: '14px',
                zIndex: 1,
                boxShadow: isCurrent ? '0 0 0 4px rgba(234, 88, 12, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {index + 1}
              </div>

              {/* Step Label */}
              <div style={{
                fontSize: '13px',
                fontWeight: isCurrent ? '800' : '600',
                color: isCurrent ? '#ea580c' : isCompleted ? '#475569' : '#94a3b8',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {step.label}
              </div>

              {/* Status Indicator (Check / Dot / Circle) */}
              <div style={{
                fontSize: '16px',
                color: isCompleted ? '#10b981' : isCurrent ? '#ea580c' : '#cbd5e1',
                marginTop: '-4px'
              }}>
                {isCompleted ? '✓' : isCurrent ? '●' : '○'}
              </div>

            </div>
          );
        })}
      </div>

      {/* Package Header Info */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
          {selectedPackage?.name || selectedPackage?.title || "Event Booking"}
        </h2>
        {selectedPackage && (
          <span style={{ fontSize: '24px', fontWeight: '900', color: '#ea580c' }}>
            ₹{Number(selectedPackage.offerPrice || selectedPackage.price || 0).toLocaleString()}
          </span>
        )}
      </div>

      <div className="step-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default BookingStepper;
