const express = require("express");
const router = express.Router({ mergeParams: true });
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", 
  authMiddleware,
  bookingController.createBooking
);
router.get(
  "/show/:showId/seats",
  bookingController.getBookedSeats
);
router.get(
  "/show/:showId/availability", 
  bookingController.getSeatAvailabilty
);
router.patch(
  "/:bookingId/confirm",
    authMiddleware, 
    bookingController.confirmBooking
);
router.patch(
  "/:bookingId/cancel",
   authMiddleware,
   bookingController.cancelBooking
);

router.get(
  "/me",
  authMiddleware,
  bookingController.getMyBookings
);

// temporary for testing
router.get(
  "/user/:userId", 
  bookingController.getMyBookings
);
module.exports = router;
