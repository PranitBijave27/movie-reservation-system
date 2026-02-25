const express = require("express");
const router = express.Router({mergeParams:true});
const screenController = require("../controllers/screenController");

router.post("/", screenController.createScreen);

module.exports = router;