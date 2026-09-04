const express = require("express");

const {
  transferMoney
} = require("../controllers/TransferController");

const router = express.Router();


// Transfer money
router.post("/", transferMoney);


module.exports = router;