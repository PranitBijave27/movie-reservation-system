const express = require("express");
const router = express.Router({mergeParams:true});
const screenController = require("../controllers/screenController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/",
    authMiddleware,
    adminMiddleware, 
    screenController.createScreen
);

module.exports = router;