const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authHandler = require("../middleware/authHandler");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authHandler, authController.getMe);

module.exports = router;
