const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { createTransfer } = require('../controllers/TransferController');

const router = express.Router();
router.use(requireAuth);
router.post('/', createTransfer);

module.exports = router;