const express = require("express");
const router = express.Router({ mergeParams: true });
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/",authMiddleware, bookingController.createBooking);

router.get("/show/:showId/seats",bookingController.getBookedSeats);
router.get("/show/:showId/availability",bookingController.getSeatAvailabilty);

router.get("/me",authMiddleware, bookingController.getMyBookings);

router.patch("/:bookingId/confirm", authMiddleware, bookingController.confirmBooking);
router.patch("/:bookingId/cancel", authMiddleware, bookingController.cancelBooking );

module.exports = router;