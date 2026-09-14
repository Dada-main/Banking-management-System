const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { insertNin, validateNin } = require('../controllers/NIN.controller');

const router = express.Router();
router.use(requireAuth);
router.post('/', insertNin);
router.post('/validate', validateNin);

module.exports = router;