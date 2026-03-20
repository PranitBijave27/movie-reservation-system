const express = require("express");
const router = express.Router({mergeParams:true});
const theaterController = require("../controllers/theaterController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {validateTheater}=require("../validators/theaterValidator");

router.route("/")
    .post(
        authMiddleware,
        adminMiddleware,
        validateTheater,
        theaterController.createTheater)
    .get( theaterController.getTheaters);

router.get("/:id", theaterController.getTheater);

module.exports = router;