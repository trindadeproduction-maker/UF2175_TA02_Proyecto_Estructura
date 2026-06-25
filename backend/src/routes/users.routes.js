const router = require("express").Router();

const {
getUsers,
getUsersByid,
createUsers
} = require("../controllers/users.controller");

router.get("/",getUsers); // GET /users
router.get("/:id",getUsersByid); // GET /users/:id
router.post("/", createUsers); // POST /users


module.exports = router;
