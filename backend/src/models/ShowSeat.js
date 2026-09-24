const mongoose = require("mongoose");

const showSeatSchema = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
      index: true,
    },
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["locked", "booked"],
      default: "locked",
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound UNIQUE index: Enforces that no two bookings can ever reserve or hold
// the same seat for the same show simultaneously, throwing code 11000 on conflict.
showSeatSchema.index({ showId: 1, seatId: 1 }, { unique: true });

module.exports = mongoose.model("ShowSeat", showSeatSchema);
