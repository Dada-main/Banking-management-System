const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
    unique: true
  },

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
{ timestamps: true }
);


// Create model

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;