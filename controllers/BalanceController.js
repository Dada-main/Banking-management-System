const Account = require("../models/Account");
const { nibssRequest } = require("../config/nibss");


// Always scoped to the logged-in customer's own account — never accepts
// an account number from the request.
const getBalance = async (req, res) => {

  try {

    const account = await Account.findOne({
      customer: req.user.customerId
    });


    if (!account) {

      return res.status(404).json({
        message: "No account found for this customer"
      });

    }


    const liveBalance = await nibssRequest(
      "get",
      `/api/account/balance/${account.accountNumber}`
    );


    res.status(200).json({

      message: "Balance retrieved successfully",

      accountNumber: account.accountNumber,

      data: liveBalance

    });

  } catch (error) {

    console.error(
      "Balance check failed:",
      error.message
    );

    res.status(500).json({

      message: "Balance check failed",

      error: error.response?.data || error.message

    });

  }

};


module.exports = {
  getBalance
};