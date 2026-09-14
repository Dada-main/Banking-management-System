const Transaction = require("../models/Transaction");
const { nibssRequest } = require("../config/nibss");


// Scoped so a customer can only check status of THEIR OWN transaction.
const getTransactionStatus = async (req, res) => {

  try {

    const { reference } = req.params;


    const localTx = await Transaction.findOne({
      reference,
      owner: req.user.customerId
    });


    if (!localTx) {

      return res.status(404).json({
        message: "Transaction not found for this customer"
      });

    }


    const liveStatus = await nibssRequest(
      "get",
      `/api/transaction/${reference}`
    );


    if (liveStatus.status && liveStatus.status !== localTx.status) {

      localTx.status = liveStatus.status;

      await localTx.save();

    }


    res.status(200).json({

      message: "Transaction status retrieved",

      local: localTx,

      live: liveStatus

    });

  } catch (error) {

    console.error(
      "Transaction status check failed:",
      error.message
    );

    res.status(500).json({

      message: "Transaction status check failed",

      error: error.response?.data || error.message

    });

  }

};


// Only ever the requesting customer's own history — derived from the
// JWT (req.user.customerId), never a query param.
const getHistory = async (req, res) => {

  try {

    const history = await Transaction.find({
      owner: req.user.customerId
    }).sort({ createdAt: -1 });


    res.status(200).json({

      message: "Transaction history retrieved",

      count: history.length,

      data: history

    });

  } catch (error) {

    console.error(
      "Fetching transaction history failed:",
      error.message
    );

    res.status(500).json({

      message: "Fetching transaction history failed",

      error: error.message

    });

  }

};


module.exports = {
  getTransactionStatus,
  getHistory
};