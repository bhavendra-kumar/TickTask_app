const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// 🔒 Protected route
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome, your ID is ${req.user.id}` });
});

module.exports = router;
