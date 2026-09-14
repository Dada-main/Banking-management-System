const { nibssRequest } = require("../config/nibss");


// Lookup on the RECIPIENT's account before a transfer — this one is
// intentionally NOT restricted to the caller's own account.
const nameEnquiry = async (req, res) => {

  try {

    const { accountNumber } = req.params;


    if (!accountNumber) {

      return res.status(400).json({
        message: "accountNumber is required"
      });

    }


    const result = await nibssRequest(
      "get",
      `/api/account/name-enquiry/${accountNumber}`
    );


    res.status(200).json({

      message: "Name enquiry successful",

      data: result

    });

  } catch (error) {

    console.error(
      "Name enquiry failed:",
      error.message
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