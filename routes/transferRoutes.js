const express = require("express");

const {
  transferMoney,
  interbankTransfer
} = require("../controllers/TransferController");

const router = express.Router();


// Intra-bank transfer
router.post("/", transferMoney);


// Interbank transfer
router.post("/interbank", interbankTransfer);


module.exports = router;