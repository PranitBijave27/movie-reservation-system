const Seat=require("../models/Seat");
const Booking = require("../models/Booking");
const Show = require("../models/Show");

exports.createBooking = async ({ userId, showId, seatIds }) => {

    const show = await Show.findById(showId); // show verification
    if(!show){
        throw new Error("Show not found");
    }

    if(show.status !== "scheduled")
        throw new Error("Show not available");

    const seats=await Seat.find({
        _id:{$in:seatIds},
        screenId:show.screenId
    });

    if (seats.length !== seatIds.length)
        throw new Error("Invalid seats selected");

    const existing = await Booking.findOne({
        showId,
        seats: { $in: seatIds },
        status: { $in: ["pending","confirmed"] } //Pending These are seats currently in someone's "cart"
    });

    if (existing)
        throw new Error("Some seats already booked");

    
    let totalAmount = seats.reduce((sum, seat) => {
        let multiplier = 1;
        if(seat.type === "premium") multiplier = 1.2;
        if(seat.type === "vip") multiplier = 1.5;

        return sum + show.basePrice * multiplier;
    },0);

    totalAmount = Math.round(totalAmount);
    //5 minutes lock for seat
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const booking=await Booking.create({
        userId,
        showId,
        seats:seatIds,
        totalAmount,
        expiresAt
    });
    return booking;
}


exports.getBookedSeats = async (showId) => {

  const bookings = await Booking.find({
    showId,
    status: { $in: ["pending","confirmed"] }
  })
  .select("seats -_id")
  ;

  const bookedSeatIds = bookings.flatMap(b => b.seats);

  return bookedSeatIds;

};