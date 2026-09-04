const axios = require("axios");
const NIN = require("../models/NIN");


// Get NIBSS token
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


// Insert NIN
const insertNIN = async (req, res) => {
  try {
    const {
      nin,
      firstName,
      lastName,
      phoneNumber, // <-- 1. Extract phoneNumber
      dateOfBirth
    } = req.body;

    // Validate required fields
    if (
      !nin ||
      !firstName ||
      !lastName ||
      !phoneNumber || // <-- 2. Validate phoneNumber
      !dateOfBirth
    ) {
      return res.status(400).json({
        message: "All NIN fields (nin, firstName, lastName, phoneNumber, dateOfBirth) are required"
      });
    }

    // Check if NIN already exists
    const existingNIN = await NIN.findOne({ nin });
    if (existingNIN) {
      return res.status(400).json({
        message: "NIN already exists"
      });
    }

    // Get NIBSS token
    const token = await getNibssToken();

    // Send NIN to NIBSS
    const response = await axios.post(
      `${process.env.NIBSS_BASE_URL}/api/insertNin`,
      {
        nin,
        firstName,
        lastName,
        phoneNumber,
        dob: dateOfBirth
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Save NIN locally
    const newNIN = await NIN.create({
      nin,
      firstName,
      lastName,
      phoneNumber, // <-- 3. Pass phoneNumber to Mongoose
      dateOfBirth,
      verified: false
    });

    res.status(201).json({
      message: "NIN inserted successfully",
      data: newNIN,
      nibssResponse: response.data
    });

  } catch (error) {
    console.error(
      "NIN insertion failed:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "NIN insertion failed",
      error: error.response?.data || error.message
    });
  }
};


// Validate NIN
const validateNIN = async (req, res) => {

  try {

    const { nin } = req.body;


    if (!nin) {

      return res.status(400).json({
        message: "NIN is required"
      });

    }


    // Get NIBSS token
    const token = await getNibssToken();


    // Send NIN validation request to NIBSS
    const response = await axios.post(
      `${process.env.NIBSS_BASE_URL}/api/validateNin`,
      {
        nin
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    // Update local NIN as verified
    const updatedNIN = await NIN.findOneAndUpdate(
      { nin },
      { verified: true },
      { new: true }
    );


    res.status(200).json({
      message: "NIN validated successfully",
      data: updatedNIN,
      nibssResponse: response.data
    });

  } catch (error) {

    console.error(
      "NIN validation failed:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "NIN validation failed",
      error: error.response?.data || error.message
    });

  }
};


module.exports = {
  insertNIN,
  validateNIN
};