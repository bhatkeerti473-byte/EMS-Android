import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function RazorpayPayment({ bookingData, advanceAmount, onPaymentSuccess, onPaymentClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayKey, setRazorpayKey] = useState("rzp_test_SGkB8sZW1kNRvT");
  const [scriptLoaded, setScriptLoaded] = useState(Boolean(window.Razorpay));
  const paymentStartedRef = useRef(false);

  useEffect(() => {
    // Check Razorpay connection on component mount
    const checkRazorpayConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/payments/health`);
        const data = await response.json();

        if (data.success) {
          console.log("✅ " + data.message);
        } else {
          console.warn("⚠️ " + data.message);
          setError(data.message);
        }
      } catch (err) {
        console.error("❌ Cannot reach payment server:", err);
        setError("Cannot connect to payment server. Ensure backend is running on localhost:5000");
      }
    };

    checkRazorpayConnection();

    // Fetch Razorpay key from backend
    const fetchRazorpayKey = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/payments/razorpay-key`);
        const data = await response.json();
        if (data.success) {
          console.log("✅ Razorpay key fetched successfully");
          setRazorpayKey(data.key);
        }
      } catch (err) {
        console.warn("⚠️ Using default test key:", err.message);
      }
    };

    fetchRazorpayKey();
  }, []);

  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError("Unable to load Razorpay checkout. Please check your connection and try again.");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePaymentClick = async () => {
    if (paymentStartedRef.current) return;
    paymentStartedRef.current = true;
    setLoading(true);
    setError("");

    try {
      // Check if backend is reachable
      if (!bookingData.booking_id) {
        throw new Error("Invalid booking data. Please refresh and try again.");
      }

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout is still loading. Please try again in a moment.");
      }

      console.log(`📝 Initiating payment for booking: ${bookingData.booking_id}`);

      // Step 1: Create order on backend
      const orderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          booking_id: bookingData.booking_id,
          amount: parseFloat(advanceAmount),
          client_id: bookingData.client_id,
          phone_number: bookingData.phone_number,
          event_type: bookingData.event_type,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        const errorMsg = orderData.message || orderData.error || "Failed to create payment order";
        console.error("❌ Order creation failed:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!orderData.order_id) {
        throw new Error("Invalid order ID received from server");
      }

      console.log(`✅ Payment order created: ${orderData.order_id}`);

      // Step 2: Open Razorpay payment gateway
      if (!window.Razorpay) {
        throw new Error("Razorpay script not loaded. Please refresh the page.");
      }

      const options = {
        key: razorpayKey,
        amount: orderData.amount, // Amount in paise
        currency: "INR",
        name: "Event Management System",
        description: `Booking for ${bookingData.event_type}`,
        image: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
        order_id: orderData.order_id,
        handler: async (response) => {
          // Step 3: Verify payment on backend
          await verifyPayment(response, orderData.order_id);
        },
        prefill: {
          name: bookingData.client_name || "Guest",
          email: bookingData.client_email || "",
          contact: bookingData.phone_number,
        },
        notes: {
          booking_id: bookingData.booking_id,
          event_type: bookingData.event_type,
          event_date: bookingData.event_date,
        },
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          emi: true,
          paylater: true,
        },
        modal: {
          ondismiss: () => {
            paymentStartedRef.current = false;
            setLoading(false);
            onPaymentClose?.();
          },
        },
        theme: {
          color: "#ec4899",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        paymentStartedRef.current = false;
        setError(response?.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      razorpay.open();
      setLoading(false);
    } catch (err) {
      const errorMessage = err.message || "Failed to initiate payment. Please try again.";
      paymentStartedRef.current = false;
      console.error("❌ Payment error:", errorMessage);
      setError(`❌ ${errorMessage}`);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      console.log(`🔐 Verifying payment for order: ${orderId}`);

      const verificationResponse = await fetch(
        `${API_BASE_URL}/api/payments/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            booking_id: bookingData.booking_id,
            client_id: bookingData.client_id,
            amount_paid: parseFloat(advanceAmount),
          }),
        }
      );

      const verificationData = await verificationResponse.json();

      if (!verificationResponse.ok) {
        const errorMsg = verificationData.message || verificationData.error || "Payment verification failed";
        console.error("❌ Verification error:", errorMsg);
        throw new Error(errorMsg);
      }

      console.log(`✅ Payment verified successfully:`, verificationData);

      // Payment successful callback hook
      onPaymentSuccess(verificationData);
    } catch (err) {
      const errorMessage = err.message || "Payment verification failed. Please contact support.";
      console.error("❌ Verification error:", errorMessage);
      setError(`❌ ${errorMessage}`);
      paymentStartedRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically trigger payment when the component mounts and script is ready
    if (!loading && !error && scriptLoaded && bookingData?.booking_id) {
      const timer = setTimeout(() => {
        handlePaymentClick();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData, error, loading, scriptLoaded]);

  if (error) {
    return (
      <div className="razorpay-payment-overlay">
        <div className="razorpay-payment-modal" style={{ textAlign: 'center', padding: '40px' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h3>Payment Error</h3>
          <p>{error}</p>
          <button className="modal-close-btn" onClick={onPaymentClose} style={{ marginTop: '24px', position: 'static' }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="razorpay-payment-overlay">
      <div className="razorpay-payment-modal" style={{ textAlign: 'center', padding: '60px 40px', background: 'transparent', boxShadow: 'none' }}>
        <Loader size={48} className="spin" color="#ea580c" style={{ margin: '0 auto 24px' }} />
        <h2 style={{ color: '#fff' }}>Connecting to secure payment gateway...</h2>
        <p style={{ color: '#cbd5e1' }}>Please do not close this window.</p>
      </div>
    </div>
  );
}
