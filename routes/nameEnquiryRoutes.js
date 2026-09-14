const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { nameEnquiry } = require('../controllers/NameEnquiryController');

const router = express.Router();
router.use(requireAuth);
router.get('/:accountNumber', nameEnquiry);

module.exports = router;