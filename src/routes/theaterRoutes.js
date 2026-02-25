const express = require("express");
const router = express.Router({mergeParams:true});
const theaterController = require("../controllers/theaterController");

router.post("/", theaterController.createTheater);
router.get("/", theaterController.getTheaters);
router.get("/:id", theaterController.getTheater);

module.exports = router;