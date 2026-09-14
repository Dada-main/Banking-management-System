const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getBalance } = require('../controllers/BalanceController');

const router = express.Router();
router.use(requireAuth);
router.get('/', getBalance);

module.exports = router;