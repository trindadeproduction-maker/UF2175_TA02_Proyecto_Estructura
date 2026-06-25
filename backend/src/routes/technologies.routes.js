const router = require("express").Router();

const {
    getTechnologies,
    getTechnologiesById,
    createTechnologies,
    updateTechnologies,
    deleteTechnologies,
} = require("../controllers/technologies.controller");

router.get("/",getTechnologies); // GET /technologies
router.get("/:id", getTechnologiesById); // GET /technologies/id
router.post("/",createTechnologies); // POST/technologies
router.put("/:id", updateTechnologies); //Put /technologies/id
router.delete("/:id",deleteTechnologies); // Delete /technologies/id


module.exports = router;