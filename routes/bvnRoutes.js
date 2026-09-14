const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { insertBvn, validateBvn } = require('../controllers/BVNController');

const router = express.Router();
router.use(requireAuth);
router.post('/', insertBvn);
router.post('/validate', validateBvn);

module.exports = router;