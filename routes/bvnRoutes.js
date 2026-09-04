const express = require("express");

const {
  insertBVN,
  validateBVN
} = require("../controllers/BVNController");

const router = express.Router();


// Insert BVN
router.post("/insert", insertBVN);


// Validate BVN
router.post("/validate", validateBVN);


module.exports = router;