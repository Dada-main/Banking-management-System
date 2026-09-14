const NIN = require("../models/NIN");
const Customer = require("../models/Customer");
const { nibssRequest } = require("../config/nibss");


const insertNin = async (req, res) => {

  try {

    const {
      nin,
      firstName,
      lastName,
      dob
    } = req.body;


    if (!nin) {

      return res.status(400).json({
        message: "nin is required"
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


    const existing = await NIN.findOne({
      customer: customer._id
    });

    if (existing) {

      return res.status(400).json({
        message: "Customer has already submitted a NIN"
      });

    }


    await nibssRequest(
      "post",
      "/api/insertNin",
      { data: { nin, firstName, lastName, dob } }
    );


    const validation = await nibssRequest(
      "post",
      "/api/validateNin",
      { data: { nin } }
    );


    const record = await NIN.create({

      customer: customer._id,

      nin,

      firstName,

      lastName,

      dob,

      verified: true,

      verifiedAt: new Date()

    });


    res.status(201).json({

      message: "NIN verified successfully",

      data: record,

      validation

    });

  } catch (error) {

    console.error(
      "NIN verification failed:",
      error.message
    );

    res.status(500).json({

      message: "NIN verification failed",

      error: error.response?.data || error.message

    });

  }

};


const validateNin = async (req, res) => {

  try {

    const { nin } = req.body;


    if (!nin) {

      return res.status(400).json({
        message: "nin is required"
      });

    }


    const result = await nibssRequest(
      "post",
      "/api/validateNin",
      { data: { nin } }
    );


    res.status(200).json({

      message: "NIN validation successful",

      data: result

    });

  } catch (error) {

    console.error(
      "NIN validation failed:",
      error.message
    );

    res.status(500).json({

      message: "NIN validation failed",

      error: error.response?.data || error.message

    });

  }

};


module.exports = {
  insertNin,
  validateNin
};