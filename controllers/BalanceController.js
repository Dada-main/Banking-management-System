const Account = require("../models/Account");


// Check account balance
const getBalance = async (req, res) => {

  try {

    const { accountNumber } = req.params;


    // Validate account number
    if (!accountNumber) {

      return res.status(400).json({
        message: "Account number is required"
      });

    }


    // Find account
    const account = await Account.findOne({
      accountNumber
    });


    // Account not found
    if (!account) {

      return res.status(404).json({
        message: "Account not found"
      });

    }


    res.status(200).json({

      message: "Balance enquiry successful",

      data: {
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        balance: account.balance
      }

    });

  } catch (error) {

    console.error(
      "Balance enquiry failed:",
      error.message
    );

    res.status(500).json({

      message: "Balance enquiry failed",

      error: error.message

    });

  }

};


module.exports = {
  getBalance
};