const express = require("express");
const router = express.Router();

const interviewsController = require("../controllers/interviews.controller");

router.get("/", interviewsController.getAllInterviews);
router.get("/:id", interviewsController.getInterviewById);
router.post("/", interviewsController.createInterview);
router.put("/:id", interviewsController.updateInterview);
router.delete("/:id", interviewsController.deleteInterview);

module.exports = router;