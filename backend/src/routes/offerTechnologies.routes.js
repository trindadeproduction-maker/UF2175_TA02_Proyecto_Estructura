const express = require("express");
const router = express.Router();

const {
    getOfferTechnologies,
    getTechnologiesByOfferId,
    addTechnologiesToOffer,
    deleteOfferTechnology,
    deleteTechnologiesByOfferId
} = require("../controllers/offerTechnologies.controller");


/* =========================================================
   READ
========================================================= */

router.get("/", getOfferTechnologies);
router.get("/offer/:offerId", getTechnologiesByOfferId);


/* =========================================================
   CREATE (bulk attach)
========================================================= */

router.post("/offer/:offerId", addTechnologiesToOffer);


/* =========================================================
   DELETE
========================================================= */

router.delete("/offer/:offerId", deleteTechnologiesByOfferId);

// composite-key deletion (required by spec)
router.delete("/:offerId/:technologyId", deleteOfferTechnology);


module.exports = router;