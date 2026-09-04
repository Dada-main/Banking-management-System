const mongoose = require("mongoose");

const ninSchema = new mongoose.Schema({
  nin: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
},
{timestamps: true}
);

//create model from schema
const NIN = mongoose.model("NIN", ninSchema);

module.exports = NIN;    //export the model to use in other files