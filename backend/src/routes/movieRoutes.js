const express = require("express");
const router = express.Router({mergeParams:true});
const movieController = require("../controllers/movieController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


router.post("/",
    authMiddleware,
    adminMiddleware,
    movieController.creatMovie);

router.get("/",movieController.getMovies);
router.get("/:id",movieController.getMovie);

router.patch("/:id/archive",
    authMiddleware,
    adminMiddleware,
    movieController.archiveMovie);

module.exports=router;