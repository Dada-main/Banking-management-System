const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  accountName: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    default: "savings"
  },
  balance: {
    type: Number,
    default: 15000
  },
  bvn: {
    type: String
  },
  nin: {
    type: String
  }
},
{timestamps: true}
);

//create model from schema
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;    //export the model to use in other files