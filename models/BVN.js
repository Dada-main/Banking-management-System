const mongoose = require("mongoose");

const bvnSchema = new mongoose.Schema({
  bvn: {
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
const BVN = mongoose.model("BVN", bvnSchema);

module.exports = BVN;    //export the model to use in other files