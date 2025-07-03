// backend/routes/authRoutes.js
import express from "express";
import { register, login } from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: `Welcome, your ID is ${req.user.id}` });
});

export default router; // ✅ This is now a valid default export
