const express = require("express");
const router = express.Router({mergeParams:true});

const showController = require("../controllers/showController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/",
    authMiddleware,
    adminMiddleware,
    showController.createShow
);

router.get("/movie/:movieId", showController.getShowsByMovie);
router.get("/:id", showController.getShowById);

module.exports = router;