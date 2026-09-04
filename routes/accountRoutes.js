const express = require("express");

const {
  createAccount
} = require("../controllers/accountController");

const router = express.Router();


// Create account
router.post("/create", createAccount);


module.exports = router;