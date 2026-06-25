const router = require("express").Router();

const {
    getJobOffers,
    getJobOfferById,
    createJobOffer,
    updateJobOffer,
    deleteJobOffer
} = require("../controllers/jobOffers.controller");

router.get("/", getJobOffers);
router.get("/:id", getJobOfferById);
router.post("/", createJobOffer);
router.put("/:id", updateJobOffer);
router.delete("/:id", deleteJobOffer);

module.exports = router;