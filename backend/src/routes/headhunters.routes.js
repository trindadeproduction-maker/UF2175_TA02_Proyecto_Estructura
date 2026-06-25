const express = require("express");
const router = express.Router();

const {
    getHeadhunters,
    getHeadhunterById,
    createHeadhunter,
    updateHeadhunter,
    deleteHeadhunter
} = require("../controllers/headhunters.controller");

router.get("/", getHeadhunters);
router.get("/:id", getHeadhunterById);
router.post("/", createHeadhunter);
router.put("/:id", updateHeadhunter);
router.delete("/:id", deleteHeadhunter);

module.exports = router;