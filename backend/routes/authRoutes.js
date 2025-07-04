const express = require("express");
const { register, login } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome, your ID is ${req.user.id}` });
});

module.exports = router;
