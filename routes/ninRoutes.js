const express = require("express");

const {
  insertNIN,
  validateNIN
} = require("../controllers/NIN.controller");

const router = express.Router();


// Insert NIN
router.post("/insert", insertNIN);


// Validate NIN
router.post("/validate", validateNIN);


module.exports = router;