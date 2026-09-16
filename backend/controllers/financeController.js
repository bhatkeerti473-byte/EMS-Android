const Finance = require("../models/Finance");
const Payment = require("../models/Payment");

// Create ledger transaction
exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, description, paymentMethod, status, recordedBy } = req.body;
    
    if (!type || !category || !amount) {
      return res.status(400).json({ success: false, message: "Type, category, and amount are required" });
    }

    const transaction = new Finance({
      type,
      category,
      amount: Number(amount),
      date: date ? new Date(date) : undefined,
      description,
      paymentMethod: paymentMethod || "Cash",
      status: status || "Completed",
      recordedBy: recordedBy || "Admin",
    });

    await transaction.save();
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Finance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Finance.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const seedDefaultExpensesIfEmpty = async () => {
  try {
    const count = await Finance.countDocuments({ type: "debit" });
    if (count === 0) {
      const sampleExpenses = [
        { type: "debit", category: "Venue Rent", amount: 145000, description: "Monthly Banquets & Hall Lease Payment", paymentMethod: "Net Banking", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-01") },
        { type: "debit", category: "Staff Salaries", amount: 280000, description: "Payroll Distribution for Event Management Staff", paymentMethod: "Net Banking", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-02") },
        { type: "debit", category: "Vendor Payout", amount: 195000, description: "Catering & Lightings Vendor Contract Clearances", paymentMethod: "UPI", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-05") },
        { type: "debit", category: "Equipment Purchase", amount: 85000, description: "New Sound Mixers & LED Stage Spotlights", paymentMethod: "Debit/Credit Card", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-07") },
        { type: "debit", category: "Maintenance", amount: 42000, description: "HVAC & Generator Annual Service Maintenance", paymentMethod: "Net Banking", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-08") },
        { type: "debit", category: "Utilities", amount: 28000, description: "Commercial Power & Water Bill", paymentMethod: "UPI", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-10") },
        { type: "debit", category: "Marketing", amount: 45000, description: "Digital Ads & Wedding Expo Promotion", paymentMethod: "Debit/Credit Card", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-11") },
        { type: "debit", category: "Taxes", amount: 62000, description: "Quarterly GST Deposit", paymentMethod: "Net Banking", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-12") },
        { type: "debit", category: "Other Expense", amount: 18000, description: "Office Supplies & Client Refreshments", paymentMethod: "Cash", status: "Completed", recordedBy: "Admin", date: new Date("2026-09-14") }
      ];
      await Finance.insertMany(sampleExpenses);
    }
  } catch (err) {
    console.error("Error seeding default expenses:", err);
  }
};

// Get all transactions (merged manual and system booking payments)
exports.getTransactions = async (req, res) => {
  try {
    await seedDefaultExpensesIfEmpty();
    const { type, category, startDate, endDate, search } = req.query;

    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch manual transactions
    const manualTransactions = await Finance.find(query).lean();

    let merged = [...manualTransactions];

    // Determine if we should also pull dynamic Payment credits
    const matchesCredit = !type || type === "credit";
    const matchesCategory = !category || category === "Event Booking";

    if (matchesCredit && matchesCategory) {
      let paymentQuery = { status: { $in: ["Paid", "Success"] } };
      
      if (startDate || endDate) {
        paymentQuery.createdAt = {};
        if (startDate) paymentQuery.createdAt.$gte = new Date(startDate);
        if (endDate) paymentQuery.createdAt.$lte = new Date(endDate);
      }

      if (search) {
        paymentQuery.$or = [
          { booking_id: { $regex: search, $options: "i" } },
          { notes: { $regex: search, $options: "i" } },
        ];
      }

      const payments = await Payment.find(paymentQuery).lean();
      const mappedPayments = payments.map((p) => ({
        _id: p._id,
        type: "credit",
        category: "Event Booking",
        amount: p.amount,
        date: p.createdAt || p.updatedAt || new Date(),
        description: p.notes || `Client Booking Payment (ID: ${p.booking_id || "N/A"})`,
        paymentMethod: p.method || p.payment_method || "Razorpay",
        status: "Completed",
        recordedBy: "System",
        isSystemGenerated: true,
      }));

      merged = [...merged, ...mappedPayments];
    }

    // Sort by date descending
    merged.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: merged.length,
      transactions: merged,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Summary Statistics
exports.getSummary = async (req, res) => {
  try {
    await seedDefaultExpensesIfEmpty();
    const { startDate, endDate } = req.query;

    let financeQuery = {};
    let paymentQuery = { status: { $in: ["Paid", "Success"] } };

    if (startDate || endDate) {
      financeQuery.date = {};
      paymentQuery.createdAt = {};
      if (startDate) {
        financeQuery.date.$gte = new Date(startDate);
        paymentQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        financeQuery.date.$lte = new Date(endDate);
        paymentQuery.createdAt.$lte = new Date(endDate);
      }
    }

    const manual = await Finance.find(financeQuery).lean();
    const payments = await Payment.find(paymentQuery).lean();

    let totalIncome = 0;
    let totalExpense = 0;
    
    // To calculate Category Breakdowns
    const categorySummary = {};
    const incomeCategories = {};
    const expenseCategories = {};

    manual.forEach((t) => {
      if (t.type === "credit") {
        totalIncome += t.amount;
        categorySummary[t.category] = (categorySummary[t.category] || 0) + t.amount;
        incomeCategories[t.category] = (incomeCategories[t.category] || 0) + t.amount;
      } else {
        totalExpense += t.amount;
        categorySummary[t.category] = (categorySummary[t.category] || 0) + t.amount;
        expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
      }
    });

    payments.forEach((p) => {
      totalIncome += p.amount;
      categorySummary["Event Booking"] = (categorySummary["Event Booking"] || 0) + p.amount;
      incomeCategories["Event Booking"] = (incomeCategories["Event Booking"] || 0) + p.amount;
    });

    const netBalance = totalIncome - totalExpense;

    // Convert category summary maps to array format for easy frontend usage
    const incomeSplit = Object.keys(incomeCategories).map((cat) => ({
      name: cat,
      value: incomeCategories[cat],
    }));

    const expenseSplit = Object.keys(expenseCategories).map((cat) => ({
      name: cat,
      value: expenseCategories[cat],
    }));

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        categorySummary,
        incomeSplit,
        expenseSplit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get monthly aggregated Profit and Loss report
exports.getProfitLossReport = async (req, res) => {
  try {
    const manual = await Finance.find().lean();
    const payments = await Payment.find({ status: { $in: ["Paid", "Success"] } }).lean();

    const monthlyMap = {};

    const getMonthStr = (d) => {
      const date = new Date(d);
      if (Number.isNaN(date.getTime())) return "TBD";
      // Format as e.g. "Jul 2026" or "2026-07"
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    };

    const getMonthLabel = (d) => {
      const date = new Date(d);
      if (Number.isNaN(date.getTime())) return "TBD";
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    manual.forEach((t) => {
      const m = getMonthStr(t.date);
      const label = getMonthLabel(t.date);
      if (m === "TBD") return;

      if (!monthlyMap[m]) {
        monthlyMap[m] = { key: m, month: label, income: 0, expense: 0, net: 0 };
      }

      if (t.type === "credit") {
        monthlyMap[m].income += t.amount;
      } else {
        monthlyMap[m].expense += t.amount;
      }
    });

    payments.forEach((p) => {
      const dateObj = p.createdAt || p.updatedAt;
      const m = getMonthStr(dateObj);
      const label = getMonthLabel(dateObj);
      if (m === "TBD") return;

      if (!monthlyMap[m]) {
        monthlyMap[m] = { key: m, month: label, income: 0, expense: 0, net: 0 };
      }

      monthlyMap[m].income += p.amount;
    });

    const report = Object.values(monthlyMap).map((item) => {
      item.net = item.income - item.expense;
      return item;
    });

    // Chronological sorting
    report.sort((a, b) => a.key.localeCompare(b.key));

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process Work Payment for Staff/Vendors
exports.processWorkPayment = async (req, res) => {
  try {
    const { bookingId, payeeId, payeeType, amount, paymentMethod } = req.body;
    
    if (!bookingId || !payeeId || !payeeType || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1. Create Finance Debit Record
    const financeRecord = new Finance({
      type: "debit",
      category: payeeType === "Staff" ? "Staff Salary" : "Vendor Payment",
      amount: Number(amount),
      date: new Date(),
      description: `Payment for ${payeeType} (ID: ${payeeId}) - Booking ID: ${bookingId}`,
      paymentMethod: paymentMethod || "Cash",
      status: "Completed",
      recordedBy: "Admin",
    });

    await financeRecord.save();

    // 2. Update Assignment Payment Status
    if (payeeType === "Staff") {
      const EventStaffAssignment = require("../models/EventStaffAssignment");
      const assignment = await EventStaffAssignment.findOne({ eventId: bookingId, employeeId: payeeId });
      
      if (assignment) {
        assignment.paymentStatus = "Paid";
        assignment.paymentId = financeRecord._id;
        await assignment.save();
      }
    } else if (payeeType === "Vendor") {
      const Booking = require("../models/Booking");
      const booking = await Booking.findById(bookingId);
      
      if (booking) {
        // Find the vendor in the vendorAssignments array
        const vendorIndex = booking.vendorAssignments.findIndex(v => v.vendorId === payeeId);
        if (vendorIndex !== -1) {
          booking.vendorAssignments[vendorIndex].paymentStatus = "Paid";
          booking.vendorAssignments[vendorIndex].paymentId = financeRecord._id;
          await booking.save();
        }
      }
    }

    res.status(200).json({ success: true, message: "Payment processed successfully", financeRecord });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
