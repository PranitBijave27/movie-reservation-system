const express = require("express");
const router = express.Router({mergeParams:true});
const screenController = require("../controllers/screenController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { validateScreen } = require("../validators/screenValidator");

router.post("/",
    authMiddleware,
    adminMiddleware, 
    validateScreen,
    screenController.createScreen);

module.exports = router;