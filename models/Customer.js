const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  accountNumber: {
    type: String,
    unique: true,
    sparse: true
  }

},
{ timestamps: true }
);


// Create model
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;