const express = require("express");
const router = express.Router();
const financeController = require("../controllers/financeController");

// Transactions CRUD
router.get("/transactions", financeController.getTransactions);
router.post("/transactions", financeController.addTransaction);
router.put("/transactions/:id", financeController.updateTransaction);
router.delete("/transactions/:id", financeController.deleteTransaction);

// Summaries & Reporting
router.get("/summary", financeController.getSummary);
router.get("/profit-loss", financeController.getProfitLossReport);

// Work Payments
router.post("/process-work-payment", financeController.processWorkPayment);

module.exports = router;
