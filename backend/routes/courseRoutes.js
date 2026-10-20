const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authHandler = require("../middleware/authHandler");
const allowRoles = require("../middleware/roleHandler");

router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);

router.post("/", authHandler, allowRoles("admin"), courseController.createCourse);
router.put("/:id", authHandler, allowRoles("admin"), courseController.updateCourse);
router.delete("/:id", authHandler, allowRoles("admin"), courseController.deleteCourse);

module.exports = router;
