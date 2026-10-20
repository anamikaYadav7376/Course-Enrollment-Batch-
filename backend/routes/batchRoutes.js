const express = require("express");
const router = express.Router();
const batchController = require("../controllers/batchController");
const authHandler = require("../middleware/authHandler");
const allowRoles = require("../middleware/roleHandler");

router.get("/", batchController.getBatches);
router.get("/:id", batchController.getBatchById);

router.post("/", authHandler, allowRoles("admin"), batchController.createBatch);
router.put("/:id", authHandler, allowRoles("admin"), batchController.updateBatch);
router.delete("/:id", authHandler, allowRoles("admin"), batchController.deleteBatch);
router.get("/:id/students", authHandler, allowRoles("admin"), batchController.getBatchStudents);

module.exports = router;
