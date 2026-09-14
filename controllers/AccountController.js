const Account = require("../models/Account");
const BVN = require("../models/bvn");
const NIN = require("../models/NIN");
const Customer = require("../models/Customer");
const { nibssRequest } = require("../config/nibss");


// Create account
const createAccount = async (req, res) => {

  try {

    const {
      accountName
    } = req.body;


    if (!accountName) {

      return res.status(400).json({
        message: "Account name is required"
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


    // A customer can only have one account
    if (customer.accountNumber) {

      return res.status(400).json({
        message: "Customer already has an account"
      });

    }


    // Find verified BVN
    const verifiedBVN = await BVN.findOne({
      customer: customer._id,
      verified: true
    });


    // Find verified NIN
    const verifiedNIN = await NIN.findOne({
      customer: customer._id,
      verified: true
    });


    // Customer must have either BVN or NIN
    if (!verifiedBVN && !verifiedNIN) {

      return res.status(400).json({
        message:
          "Customer must have a verified BVN or NIN before creating an account"
      });

    }


    // --------------------------------
    // Prepare KYC information
    // --------------------------------

    let kycType;
    let kycID;
    let DOB;


    if (verifiedBVN) {

      // NOTE: NIBSS expects lowercase kycType values ("bvn" / "nin")
      kycType = "bvn";

      kycID = verifiedBVN.bvn;

      DOB = verifiedBVN.dob;

    } else if (verifiedNIN) {

      kycType = "nin";

      kycID = verifiedNIN.nin;

      DOB =
        verifiedNIN.dob ||
        verifiedNIN.dateOfBirth;

    }


    // Make sure KYC information exists
    if (!kycType || !kycID || !DOB) {

      return res.status(400).json({
        message: "KYC information is incomplete",
        data: {
          kycType,
          kycID,
          DOB
        }
      });

    }


    // --------------------------------
    // Create account on NIBSS
    // --------------------------------

    console.log("ACCOUNT KYC DATA:", {
      kycType,
      kycID,
      DOB
    });

    const nibssAccount = await nibssRequest(

      "post",
      "/api/account/create",
      {
        data: {

          kycType,

          kycID,

          dob: DOB

        }
      }
    );


    // --------------------------------
    // Get account number from NIBSS
    // --------------------------------

    // NOTE: NIBSS nests the created account under an "account" key,
    // e.g. { message, account: { accountNumber, ... } }
    const accountNumber =
      nibssAccount.account?.accountNumber ||
      nibssAccount.account?.account_number ||
      nibssAccount.accountNumber ||
      nibssAccount.account_number;


    if (!accountNumber) {

      return res.status(502).json({

        message: "NIBSS did not return an account number",

        upstream: nibssAccount

      });

    }


    // --------------------------------
    // Save account locally
    // --------------------------------

    const account = await Account.create({

      customer: customer._id,

      accountNumber,

      accountName,

      accountType: "savings",

      balance: 15000,

      bvn: verifiedBVN
        ? verifiedBVN.bvn
        : undefined,

      nin: verifiedNIN
        ? verifiedNIN.nin
        : undefined

    });


    // --------------------------------
    // Update customer
    // --------------------------------

    customer.accountNumber = accountNumber;


    if (verifiedBVN) {

      customer.bvn = verifiedBVN.bvn;

    }


    if (verifiedNIN) {

      customer.nin = verifiedNIN.nin;

    }


    await customer.save();


    // --------------------------------
    // Response
    // --------------------------------

    res.status(201).json({

      message: "Account created successfully",

      data: account

    });


  } catch (error) {

    console.error(
      "Account creation failed:",
      error.message
    );


    console.error(
      "NIBSS response:",
      error.response?.data
    );


    res.status(
      error.response?.status || 500
    ).json({

      message: "Account creation failed",

      error:
        error.response?.data ||
        error.message

    });

  }

};


// Get the logged-in customer's own account only
// (never proxy NIBSS's full /api/accounts list here — that would
// leak every customer's account across the whole fintech and break
// data isolation)
const getAccounts = async (req, res) => {

  try {

    const account = await Account.findOne({
      customer: req.user.customerId
    });


    if (!account) {

      return res.status(404).json({
        message: "You do not have an account yet"
      });

    }


    res.status(200).json({

      message: "Account retrieved successfully",

      data: account

    });

  } catch (error) {

    console.error(
      "Fetching account failed:",
      error.message
    );

    res.status(500).json({

      message: "Fetching account failed",

      error: error.message

    });

  }

};


module.exports = {
  createAccount,
  getAccounts
};