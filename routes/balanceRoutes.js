const express = require("express");

const {
  getBalance
} = require("../controllers/BalanceController");

const router = express.Router();


// Balance enquiry
router.get("/:accountNumber", getBalance);


module.exports = router;