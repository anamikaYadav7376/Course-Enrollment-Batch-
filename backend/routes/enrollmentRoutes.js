const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authHandler = require("../middleware/authHandler");
const allowRoles = require("../middleware/roleHandler");

router.post("/", authHandler, allowRoles("student"), enrollmentController.enrollInBatch);
router.get("/my", authHandler, enrollmentController.getMyEnrollments);

router.put("/:id/status", authHandler, allowRoles("admin"), enrollmentController.updateEnrollmentStatus);

module.exports = router;
