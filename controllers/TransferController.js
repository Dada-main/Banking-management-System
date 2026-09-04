const Account = require("../models/Account");
const Transaction = require("../models/Transaction");


// Generate transaction reference
const generateTransactionReference = () => {

  return `TXN-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}`;

};


// Transfer money
const transferMoney = async (req, res) => {

  try {

    const {
      from,
      to,
      amount
    } = req.body;


    // Validate required fields
    if (!from || !to || !amount) {

      return res.status(400).json({
        message: "Sender account, receiver account and amount are required"
      });

    }


    // Validate amount
    if (amount <= 0) {

      return res.status(400).json({
        message: "Transfer amount must be greater than zero"
      });

    }


    // Prevent transfer to same account
    if (from === to) {

      return res.status(400).json({
        message: "Sender and receiver accounts cannot be the same"
      });

    }


    // Find sender account
    const senderAccount = await Account.findOne({
      accountNumber: from
    });


    if (!senderAccount) {

      return res.status(404).json({
        message: "Sender account not found"
      });

    }


    // Find receiver account
    const receiverAccount = await Account.findOne({
      accountNumber: to
    });


    if (!receiverAccount) {

      return res.status(404).json({
        message: "Receiver account not found"
      });

    }


    // Check sufficient balance
    if (senderAccount.balance < amount) {

      return res.status(400).json({
        message: "Insufficient balance"
      });

    }


    // Deduct money from sender
    senderAccount.balance -= amount;

    await senderAccount.save();


    // Add money to receiver
    receiverAccount.balance += amount;

    await receiverAccount.save();


    // Generate transaction reference
    const transactionReference = generateTransactionReference();


    // Save transaction
    const transaction = await Transaction.create({

      transactionReference,

      senderAccount: from,

      receiverAccount: to,

      amount,

      transactionType: "intra-bank",

      status: "successful",

      description: "Intra-bank transfer"

    });


    res.status(200).json({

      message: "Transfer successful",

      data: {
        transactionReference,
        senderAccount: from,
        receiverAccount: to,
        amount,
        status: "successful"
      }

    });

  } catch (error) {

    console.error(
      "Transfer failed:",
      error.message
    );

    res.status(500).json({

      message: "Transfer failed",

      error: error.message

    });

  }

};


module.exports = {
  transferMoney
};