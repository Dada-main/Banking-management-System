const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getTransactionStatus, getHistory } = require('../controllers/TransactionController');

const router = express.Router();
router.use(requireAuth);
router.get('/history', getHistory);
router.get('/:reference/status', getTransactionStatus);

module.exports = router;