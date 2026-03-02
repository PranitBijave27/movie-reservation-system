const express = require("express");
const router = express.Router({mergeParams:true});
const bookingController = require("../controllers/bookingController");

router.post("/", bookingController.createBooking);
router.get("/show/:showId/seats", bookingController.getBookedSeats);
router.get("/show/:showId/availability",bookingController.getSeatAvailabilty);
router.patch("/:bookingId/confirm",bookingController.confirmBooking);
router.patch("/:bookingId/cancel",bookingController.cancelBooking);

router.get("/me",bookingController.getMyBookings
);

// temporary for testing
router.get(
  "/user/:userId",
  bookingController.getMyBookings
);
module.exports = router;