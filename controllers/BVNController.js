const axios = require("axios");
const BVN = require("../models/bvn");
const Customer = require("../models/Customer");
const { nibssRequest } = require("../config/nibss");


// Insert + validate BVN for the logged-in customer
const insertBvn = async (req, res) => {

  try {

    const {
      bvn,
      firstName,
      lastName,
      dob,
      phone
    } = req.body;


    if (!bvn) {

      return res.status(400).json({
        message: "bvn is required"
      });

    }


    const customer = await Customer.findById(
      req.user.customerId
    );

    if (!customer) {

      return res.status(404).json({
        message: "Customer not found"
      });

    }


    // A customer can only submit BVN once — re-verifying overwrites nothing
    const existing = await BVN.findOne({
      customer: customer._id
    });

    if (existing) {

      return res.status(400).json({
        message: "Customer has already submitted a BVN"
      });

    }


    await nibssRequest(
      "post",
      "/api/insertBvn",
      { data: { bvn, firstName, lastName, dob, phone } }
    );


    const validation = await nibssRequest(
      "post",
      "/api/validateBvn",
      { data: { bvn } }
    );


    const record = await BVN.create({

      customer: customer._id,

      bvn,

      firstName,

      lastName,

      dob,

      phone,

      verified: true,

      verifiedAt: new Date()

    });


    res.status(201).json({

      message: "BVN verified successfully",

      data: record,

      validation

    });

  } catch (error) {

    console.error(
      "BVN verification failed:",
      error.message
    );

    res.status(500).json({

      message: "BVN verification failed",

      error: error.response?.data || error.message

    });

  }

};


// Standalone validate — doesn't require an existing record
const validateBvn = async (req, res) => {

  try {

    const { bvn } = req.body;


    if (!bvn) {

      return res.status(400).json({
        message: "bvn is required"
      });

    }


    const result = await nibssRequest(
      "post",
      "/api/validateBvn",
      { data: { bvn } }
    );


    res.status(200).json({

      message: "BVN validation successful",

      data: result

    });

  } catch (error) {

    console.error(
      "BVN validation failed:",
      error.message
    );

    res.status(500).json({

      message: "BVN validation failed",

      error: error.response?.data || error.message

    });

  }

};


module.exports = {
  insertBvn,
  validateBvn
};