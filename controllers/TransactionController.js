const Transaction = require("../models/Transaction");


// Get transaction status
const getTransactionStatus = async (req, res) => {

  try {

    const { ref } = req.params;


    // Validate reference
    if (!ref) {

      return res.status(400).json({
        message: "Transaction reference is required"
      });

    }


    // Find transaction
    const transaction = await Transaction.findOne({
      transactionReference: ref
    });


    // Transaction not found
    if (!transaction) {

      return res.status(404).json({
        message: "Transaction not found"
      });

    }


    res.status(200).json({

      message: "Transaction status retrieved successfully",

      data: {
        transactionReference: transaction.transactionReference,
        senderAccount: transaction.senderAccount,
        receiverAccount: transaction.receiverAccount,
        amount: transaction.amount,
        transactionType: transaction.transactionType,
        status: transaction.status,
        description: transaction.description,
        createdAt: transaction.createdAt
      }

    });

  } catch (error) {

    console.error(
      "Transaction status failed:",
      error.message
    );

    res.status(500).json({

      message: "Transaction status failed",

      error: error.message

    });

  }

};


const getTransactionHistory = async (req, res) => {

  try {

    const { accountNumber } = req.params;


    // Validate account number
    if (!accountNumber) {

      return res.status(400).json({
        message: "Account number is required"
      });

    }


    // Find transactions involving this account
    const transactions = await Transaction.find({

      $or: [
        { senderAccount: accountNumber },
        { receiverAccount: accountNumber }
      ]

    }).sort({ createdAt: -1 });


    res.status(200).json({

      message: "Transaction history retrieved successfully",

      accountNumber,

      count: transactions.length,

      data: transactions

    });

  } catch (error) {

    console.error(
      "Transaction history failed:",
      error.message
    );

    res.status(500).json({

      message: "Transaction history failed",

      error: error.message

    });

  }

};


module.exports = {
  getTransactionStatus,
  getTransactionHistory
};