const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authHandler = require("../middleware/authHandler");
const allowRoles = require("../middleware/roleHandler");

router.get("/stats", authHandler, allowRoles("admin"), dashboardController.getDashboardStats);

module.exports = router;
