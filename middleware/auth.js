const jwt = require("jsonwebtoken");


const requireAuth = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization || "";

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;


    if (!token) {

      return res.status(401).json({
        message: "Missing bearer token"
      });

    }


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      customerId: decoded.customerId
    };

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message
    });

  }

};


module.exports = {
  requireAuth
};