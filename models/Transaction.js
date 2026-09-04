const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionReference: {
    type: String,
    required: true,
    unique: true
  },
  senderAccount: {
    type: String,
    required: true
  },
  receiverAccount: {
    type: String,
    required: true
  },
  receiverBankCode: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  transactionType: {
    type: String,
    enum: ["intra-bank", "inter-bank"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending"
  },
  description: {
    type: String
  }
},
{timestamps: true}
);

//create model from schema
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;    //export the model to use in other files