const express = require("express");

const {
  createAccount
} = require("../controllers/accountController");

const { protect } = require("../middleware/auth");

const router = express.Router();


// Create account
router.post("/create", protect, createAccount);


module.exports = router;