const express = require("express");
const router = express.Router({mergeParams:true});

const showController = require("../controllers/showController");

router.post("/", showController.createShow);

router.get("/movie/:movieId", showController.getShowsByMovie);

module.exports = router;