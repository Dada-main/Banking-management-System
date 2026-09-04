const axios = require("axios");
const BVN = require("../models/bvn");

const getNibssToken = async () => {

  try {

    const response = await axios.post(
      `${process.env.NIBSS_BASE_URL}/api/auth/token`,
      {
        apiKey: process.env.NIBSS_API_KEY,
        apiSecret: process.env.NIBSS_API_SECRET
      }
    );

    return response.data.token;

  } catch (error) {

    console.error(
      "NIBSS authentication failed:",
      error.response?.data || error.message
    );

    throw new Error("NIBSS authentication failed");
  }
};


// Insert BVN
const insertBVN = async (req, res) => {

  try {

    const {
      bvn,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber
    } = req.body;


    // Validate required fields
    if (
      !bvn ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !phoneNumber
    ) {

      return res.status(400).json({
        message: "All BVN fields are required"
      });

    }


    // Check if BVN already exists locally
    const existingBVN = await BVN.findOne({ bvn });

    if (existingBVN) {

      return res.status(400).json({
        message: "BVN already exists"
      });

    }


    // Get NIBSS token
    const token = await getNibssToken();


    // Send BVN to NIBSS
    const response = await axios.post(
      `${process.env.NIBSS_BASE_URL}/api/insertBvn`,
      {
        bvn,
        firstName,
        lastName,
        dob: dateOfBirth,
        phone: phoneNumber
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    // Save BVN locally
    const newBVN = await BVN.create({
      bvn,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      verified: false
    });


    res.status(201).json({
      message: "BVN inserted successfully",
      data: newBVN,
      nibssResponse: response.data
    });

  } catch (error) {

    console.error(
      "BVN insertion failed:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "BVN insertion failed",
      error: error.response?.data || error.message
    });

  }
};


// Validate BVN
const validateBVN = async (req, res) => {

  try {

    const { bvn } = req.body;


    if (!bvn) {

      return res.status(400).json({
        message: "BVN is required"
      });

    }


    // Get NIBSS token
    const token = await getNibssToken();


    // Send BVN validation request to NIBSS
    const response = await axios.post(
      `${process.env.NIBSS_BASE_URL}/api/validateBvn`,
      {
        bvn
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    // Update local BVN as verified
    const updatedBVN = await BVN.findOneAndUpdate(
      { bvn },
      { verified: true },
      { new: true }
    );


    res.status(200).json({
      message: "BVN validated successfully",
      data: updatedBVN,
      nibssResponse: response.data
    });

  } catch (error) {

    console.error(
      "BVN validation failed:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "BVN validation failed",
      error: error.response?.data || error.message
    });

  }
};


module.exports = {
  insertBVN,
  validateBVN
};