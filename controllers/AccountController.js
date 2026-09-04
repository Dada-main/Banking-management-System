const Account = require("../models/Account");
const BVN = require("../models/bvn");
const NIN = require("../models/NIN");


// Generate a 10-digit account number
const generateAccountNumber = () => {

  return Math.floor(
    1000000000 + Math.random() * 9000000000
  ).toString();

};


// Create account
const createAccount = async (req, res) => {

  try {

    const {
      accountName,
      bvn,
      nin
    } = req.body;


    // Validate account name
    if (!accountName) {

      return res.status(400).json({
        message: "Account name is required"
      });

    }


    // Customer must provide BVN or NIN
    if (!bvn && !nin) {

      return res.status(400).json({
        message: "BVN or NIN is required to create an account"
      });

    }


    let verifiedCustomer = null;


    // Check BVN
    if (bvn) {

      verifiedCustomer = await BVN.findOne({
        bvn,
        verified: true
      });

    }


    // If BVN was not verified, check NIN
    if (!verifiedCustomer && nin) {

      verifiedCustomer = await NIN.findOne({
        nin,
        verified: true
      });

    }


    // Customer must be verified
    if (!verifiedCustomer) {

      return res.status(400).json({
        message: "Customer must have a verified BVN or NIN before creating an account"
      });

    }


    // Check if customer already has an account
    const existingAccount = await Account.findOne({
      $or: [
        ...(bvn ? [{ bvn }] : []),
        ...(nin ? [{ nin }] : [])
      ]
    });


    if (existingAccount) {

      return res.status(400).json({
        message: "Customer already has an account"
      });

    }


    // Generate account number
    let accountNumber;
    let accountExists = true;


    while (accountExists) {

      accountNumber = generateAccountNumber();

      accountExists = await Account.findOne({
        accountNumber
      });

    }


    // Create account
    const account = await Account.create({

      accountNumber,

      accountName,

      accountType: "savings",

      balance: 15000,

      bvn: bvn || undefined,

      nin: nin || undefined

    });


    res.status(201).json({

      message: "Account created successfully",

      data: account

    });

  } catch (error) {

    console.error(
      "Account creation failed:",
      error.message
    );

    res.status(500).json({

      message: "Account creation failed",

      error: error.message

    });

  }

};


module.exports = {
  createAccount
};