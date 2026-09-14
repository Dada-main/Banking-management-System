const mongoose = require("mongoose");


const accountSchema = new mongoose.Schema(

  {

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
      enum: ["savings", "current"],
      default: "savings"
    },

    balance: {
      type: Number,
      default: 15000
    },

    currency: {
      type: String,
      default: "NGN"
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


module.exports = mongoose.model("Account", accountSchema);