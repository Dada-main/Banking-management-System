const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");


const issueToken = (customer) => {

  return jwt.sign(
    { customerId: customer._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

};


// Signup
const signup = async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dob
    } = req.body;


    if (!firstName || !lastName || !email || !password) {

      return res.status(400).json({
        message: "firstName, lastName, email and password are required"
      });

    }


    const existing = await Customer.findOne({
      email: email.toLowerCase()
    });

    if (existing) {

      return res.status(400).json({
        message: "A customer with this email already exists"
      });

    }


    // Combine firstName and lastName
    const name = `${firstName} ${lastName}`;


    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);


    const customer = await Customer.create({

      name,

      email: email.toLowerCase(),

      password: passwordHash

    });


    res.status(201).json({

      message: "Signup successful. Next step: verify identity via BVN or NIN.",

      data: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      },

      token: issueToken(customer)

    });

  } catch (error) {

    console.error(
      "Signup failed:",
      error.message
    );

    res.status(500).json({

      message: "Signup failed",

      error: error.message

    });

  }

};


// Login
const login = async (req, res) => {

  try {

    const { email, password } = req.body;


    const customer = await Customer.findOne({
      email: (email || "").toLowerCase()
    });


    if (!customer) {

      return res.status(401).json({
        message: "Invalid email or password"
      });

    }


    const passwordMatches = await bcrypt.compare(
      password || "",
      customer.password
    );

    if (!passwordMatches) {

      return res.status(401).json({
        message: "Invalid email or password"
      });

    }


    res.status(200).json({

      message: "Login successful",

      token: issueToken(customer)

    });

  } catch (error) {

    console.error(
      "Login failed:",
      error.message
    );

    res.status(500).json({

      message: "Login failed",

      error: error.message

    });

  }

};


module.exports = {
  signup,
  login
};