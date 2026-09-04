const express = require("express");

const {
  getTransactionStatus,
  getTransactionHistory
} = require("../controllers/TransactionController");

const router = express.Router();


// Get transaction history
router.get("/history/:accountNumber", getTransactionHistory);


// Get transaction status
router.get("/:ref", getTransactionStatus);


module.exports = router;