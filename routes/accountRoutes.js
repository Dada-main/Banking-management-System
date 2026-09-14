const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { createAccount, getAccounts } = require('../controllers/accountController');

const router = express.Router();
router.use(requireAuth);

router.post('/', createAccount);
router.get('/', getAccounts);

module.exports = router;