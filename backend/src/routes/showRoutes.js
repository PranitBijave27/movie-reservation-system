const express = require("express");
const router = express.Router({mergeParams:true});

const showController = require("../controllers/showController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { validateShow } = require("../validators/showValidator");

router.post("/",
    authMiddleware,
    adminMiddleware,
    validateShow,
    showController.createShow
);

router.get("/movie/:movieId", showController.getShowsByMovie);
router.get("/:id", showController.getShowById);

module.exports = router;