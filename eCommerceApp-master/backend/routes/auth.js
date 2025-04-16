const express = require('express');
const { register, login } = require('../controllers/authController'); // ✅ Ensure this line is correct
const router = express.Router();

router.post('/register', register); // ✅ Make sure the route is correct
router.post('/login', login);

module.exports = router;
