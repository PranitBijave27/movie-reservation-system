const express = require("express");
const router = express.Router({mergeParams:true});
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
router.get("/show/:showId/seats", bookingController.getBookedSeats);
router.get("/show/:showId/availability",bookingController.getSeatAvailabilty);

module.exports = router;