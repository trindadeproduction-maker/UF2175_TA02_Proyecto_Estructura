const router = require("express").Router();

const {
    getCompanies,
    getCompaniesById,
    createCompanies,
    updateCompanies,
    deleteCompanies
} = require("../controllers/companies.controller");

router.get("/",getCompanies); // GET /companies
router.get("/:id", getCompaniesById); // GET /companies/id

router.post("/",createCompanies); // POST/companies

router.put("/:id", updateCompanies); //Put /companies/id
router.delete("/:id", deleteCompanies); //Delete /companies/id

// router.get("/", (req, res) => {
//     res.json({ mensaje: "Ruta companies funcionando" });
// });


module.exports = router;