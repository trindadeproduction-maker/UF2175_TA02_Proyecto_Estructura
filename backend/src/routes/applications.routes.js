const express = require("express");
const router = express.Router();

const applicationsController = require("../controllers/applications.controller");

router.get("/", applicationsController.getAllApplications);
router.get("/:id", applicationsController.getApplicationById);
router.post("/", applicationsController.createApplication);
router.put("/:id", applicationsController.updateApplication);
router.delete("/:id", applicationsController.deleteApplication);

module.exports = router;