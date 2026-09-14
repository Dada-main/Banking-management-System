const mongoose = require("mongoose");


const ninSchema = new mongoose.Schema(

  {

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true
    },

    nin: {
      type: String,
      required: true
    },

    firstName: {
      type: String
    },

    lastName: {
      type: String
    },

    dob: {
      type: String
    },

    verified: {
      type: Boolean,
      default: false
    },

    verifiedAt: {
      type: Date
    }

  },

  { timestamps: true }

);


module.exports = mongoose.model("NIN", ninSchema);