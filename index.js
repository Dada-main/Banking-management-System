require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

const customerRoutes = require('./routes/customerRoutes');
const bvnRoutes = require('./routes/bvnRoutes');
const ninRoutes = require('./routes/ninRoutes');
const accountRoutes = require('./routes/accountRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const nameEnquiryRoutes = require('./routes/nameEnquiryRoutes');
const transferRoutes = require('./routes/transferRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/customers', customerRoutes);
app.use('/api/bvn', bvnRoutes);
app.use('/api/nin', ninRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/name-enquiry', nameEnquiryRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/transactions', transactionRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] Listening on port ${PORT}`));
});