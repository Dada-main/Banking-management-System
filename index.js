const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");

const bvnRoutes = require("./routes/bvnRoutes");

const ninRoutes = require("./routes/ninRoutes");

const accountRoutes = require("./routes/accountRoutes");

const nameEnquiryRoutes = require("./routes/nameEnquiryRoutes");

const balanceRoutes = require("./routes/balanceRoutes");

const transferRoutes = require("./routes/transferRoutes");

const transactionRoutes = require("./routes/transactionRoutes");

const customerRoutes = require("./routes/customerRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//BVN routes
app.use("/api/bvn", bvnRoutes);

//NIN routes
app.use("/api/nin", ninRoutes);

//Account routes
app.use("/api/account", accountRoutes);

//Name Enquiry routes
app.use("/api/account/name-enquiry", nameEnquiryRoutes);

//Balance routes
app.use("/api/account/balance", balanceRoutes);

//Transfer routes
app.use("/api/transfer", transferRoutes);

//Transaction routes
app.use("/api/transaction", transactionRoutes);

//Customer routes
app.use("/api/customer", customerRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Banking Management System API is running",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});