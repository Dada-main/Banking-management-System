const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema(

  {

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true
    },

    reference: {
      type: String,
      required: true,
      unique: true
    },

    fromAccount: {
      type: String,
      required: true
    },

    toAccount: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["INTRA_BANK", "INTER_BANK"],
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESSFUL", "FAILED"],
      default: "PENDING"
    },

    narration: {
      type: String
    },

    rawNibssResponse: {
      type: mongoose.Schema.Types.Mixed
    }

  },

  { timestamps: true }

);


module.exports = mongoose.model("Transaction", transactionSchema);