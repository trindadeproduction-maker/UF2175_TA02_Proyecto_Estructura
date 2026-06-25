const router = require("express").Router();

const {
    getCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate
} = require("../controllers/candidates.controller");

router.get("/", getCandidates);


router.get("/:id", getCandidateById);

router.post("/", createCandidate);

router.put("/:id", updateCandidate);

router.delete("/:id", deleteCandidate);

module.exports = router;