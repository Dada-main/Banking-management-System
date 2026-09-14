const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { nibssRequest } = require("../config/nibss");


// Maps NIBSS's status strings to the enum values allowed by our Transaction schema
const statusMap = {
  SUCCESS: "SUCCESSFUL",
  PENDING: "PENDING",
  FAILED: "FAILED"
};


// "from" is always derived from the logged-in customer's own account —
// never trust a from/sender field coming from the request body.
const createTransfer = async (req, res) => {

  try {

    const {
      toAccount,
      amount,
      type,
      narration
    } = req.body;


    if (!toAccount || !amount || !type) {

      return res.status(400).json({
        message: "toAccount, amount and type are required"
      });

    }


    const senderAccount = await Account.findOne({
      customer: req.user.customerId
    });

    if (!senderAccount) {

      return res.status(404).json({
        message: "You do not have an account yet"
      });

    }


    if (senderAccount.accountNumber === toAccount) {

      return res.status(400).json({
        message: "Cannot transfer to your own account"
      });

    }


    // Guard against overdrafts locally, even though NIBSS may also enforce this
    if (senderAccount.balance < Number(amount)) {

      return res.status(400).json({
        message: "Insufficient balance"
      });

    }


    const nibssResponse = await nibssRequest(
      "post",
      "/api/transfer",
      {
        data: {
          from: senderAccount.accountNumber,
          to: toAccount,
          amount: Number(amount)
        }
      }
    );


    const reference =
      nibssResponse.reference ||
      nibssResponse.txId ||
      nibssResponse.transactionId;


    const rawStatus = nibssResponse.status || "PENDING";

    const normalizedStatus =
      statusMap[rawStatus] || "PENDING";


    // --------------------------------
    // Update local balances only if the transfer actually succeeded
    // --------------------------------

    if (normalizedStatus === "SUCCESSFUL") {

      senderAccount.balance -= Number(amount);

      await senderAccount.save();


      const receiverAccount = await Account.findOne({
        accountNumber: toAccount
      });


      // Receiver might belong to a colleague and not exist in our local DB —
      // only update if we actually have a local record for it
      if (receiverAccount) {

        receiverAccount.balance += Number(amount);

        await receiverAccount.save();

      }

    }


    const transaction = await Transaction.create({

      owner: req.user.customerId,

      reference,

      fromAccount: senderAccount.accountNumber,

      toAccount,

      amount,

      type,

      narration,

      status: normalizedStatus,

      rawNibssResponse: nibssResponse

    });


    res.status(201).json({

      message: "Transfer submitted",

      data: transaction

    });

  } catch (error) {

    console.error(
      "Transfer failed:",
      error.message
    );

    res.status(500).json({

      message: "Transfer failed",

      error: error.response?.data || error.message

    });

  }

};


module.exports = {
  createTransfer
};