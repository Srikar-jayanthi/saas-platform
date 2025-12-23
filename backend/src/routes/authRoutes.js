const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register-tenant', authController.registerTenant);
router.post('/login', authController.login);
router.get('/me', authenticate, (req, res) => {
    res.json({ success: true, data: req.user });
});

module.exports = router;