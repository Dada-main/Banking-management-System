const Account = require("../models/Account");
const BVN = require("../models/bvn");
const NIN = require("../models/NIN");
const Customer = require("../models/Customer");


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


    // Find logged-in customer
    const customer = await Customer.findById(
      req.user.customerId
    );

    if (!customer) {

      return res.status(404).json({
        message: "Customer not found"
      });

    }


    // Check if customer already has an account
    if (customer.accountNumber) {

      return res.status(400).json({
        message: "Customer already has an account"
      });

    }


    let verifiedBVN = null;
    let verifiedNIN = null;


    // Check BVN
    if (bvn) {

      verifiedBVN = await BVN.findOne({
        bvn,
        verified: true
      });

    }


    // Check NIN
    if (nin) {

      verifiedNIN = await NIN.findOne({
        nin,
        verified: true
      });

    }


    // Customer must have a verified BVN or NIN
    if (!verifiedBVN && !verifiedNIN) {

      return res.status(400).json({
        message: "Customer must have a verified BVN or NIN before creating an account"
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

      customer: customer._id,

      accountNumber,

      accountName,

      accountType: "savings",

      balance: 15000,

      bvn: verifiedBVN ? verifiedBVN.bvn : undefined,

      nin: verifiedNIN ? verifiedNIN.nin : undefined

    });


    // Update customer with account number
    customer.accountNumber = accountNumber;

    if (verifiedBVN) {
      customer.bvn = verifiedBVN.bvn;
    }

    if (verifiedNIN) {
      customer.nin = verifiedNIN.nin;
    }

    await customer.save();


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