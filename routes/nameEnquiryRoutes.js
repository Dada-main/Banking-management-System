const express = require("express");

const {
  nameEnquiry
} = require("../controllers/NameEnquiryController");

const router = express.Router();


// Name enquiry
router.get("/:accountNumber", nameEnquiry);


module.exports = router;