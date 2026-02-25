const express = require("express");
const router = express.Router({mergeParams:true});
const movieController = require("../controllers/movieController");

router.post("/",movieController.creatMovie)
router.get("/",movieController.getMovies);
router.get("/:id",movieController.getMovie);
router.patch("/:id/archive",movieController.archiveMovie);

module.exports=router;