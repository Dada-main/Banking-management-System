const axios = require("axios");
const Account = require("../models/Account");


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


// Name enquiry
const nameEnquiry = async (req, res) => {

  try {

    const { accountNumber } = req.params;


    // Validate account number
    if (!accountNumber) {

      return res.status(400).json({
        message: "Account number is required"
      });

    }


    // Check local account first
    const account = await Account.findOne({
      accountNumber
    });


    if (account) {

      return res.status(200).json({

        message: "Account found",

        data: {
          accountNumber: account.accountNumber,
          accountName: account.accountName,
          accountType: account.accountType
        }

      });

    }


    // Get NIBSS token
    const token = await getNibssToken();


    // Ask NIBSS for account name
    const response = await axios.get(
      `${process.env.NIBSS_BASE_URL}/api/account/name-enquiry/${accountNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    res.status(200).json({

      message: "Name enquiry successful",

      data: response.data

    });

  } catch (error) {

    console.error(
      "Name enquiry failed:",
      error.response?.data || error.message
    );

    res.status(500).json({

      message: "Name enquiry failed",

      error: error.response?.data || error.message

    });

  }

};


module.exports = {
  nameEnquiry
};