const express = require("express");
const router = express.Router();

const salariesController = require("../controllers/salaries.controller");

router.get("/", salariesController.getAllSalaries);
router.get("/:id", salariesController.getSalaryById);
router.post("/", salariesController.createSalary);
router.put("/:id", salariesController.updateSalary);
router.delete("/:id", salariesController.deleteSalary);

module.exports = router;