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
        if(seat.type === "premium") multiplier =1.45;
        if(seat.type === "vip") multiplier = 1.75;

        return sum + show.basePrice * multiplier;
    },0);

    totalAmount = Math.round(totalAmount);
    totalAmount = Math.ceil(totalAmount);
    
    if (totalAmount % 10 === 0) {
        totalAmount = totalAmount - 1;
    }
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
  .select("seats -_id");

  const bookedSeatIds = bookings.flatMap(b => b.seats);
  return bookedSeatIds;
};

exports.getSeatAvailabilty=async(showId)=>{

    //find show
    const show=await Show.findById(showId);
    if(!show){
        throw new Error("Show not found");
    }
    //getting all seats
    const seats=await Seat.find({
        screenId:show.screenId,
        isActive:true, //not broken seat
    }).sort({row:1,number:1});

    //find booked seats
    const booking=await Booking.find({
        showId,
        status:{$in:["pending","confirmed"]}
    });
    //extracting booked seats
    const bookedSeatIds=new Set(
        booking.flatMap(b=> b.seats.map(id=>id.toString()))
    );
    const result= seats.map(seat=>({
        _id:seat._id,
        row:seat.row,
        number:seat.number,
        type:seat.type,
        isBooked:bookedSeatIds.has(seat._id.toString())
    }));
    return result;
}

exports.confirmBooking = async (bookingId) => {

    const booking = await Booking.findById(bookingId);
    if (!booking)
        throw new Error("Booking not found");
    if (booking.status !== "pending")
        throw new Error("Booking cannot be confirmed");
    if (booking.expiresAt && booking.expiresAt < new Date())
        throw new Error("Booking expired");

    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.expiresAt = null;

    await booking.save();
    return booking;
}

exports.cancelBooking = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking)
        throw new Error("Booking not found");
    if (booking.status === "cancelled")
        throw new Error("Booking already cancelled");

    const show = await Show.findById(booking.showId);

    if (!show)
        throw new Error("Show not found");

    const currentTime = new Date();
    const showTime = new Date(show.startTime);

    if ((showTime-currentTime) < 2*60*60*1000){
        if((showTime-currentTime)< 0){
            throw new Error("Cannot cancel a show that has already started or finished");
        }
        throw new Error("Cannot cancel within 2 hours of showtime");
    }

    booking.status = "cancelled";

    if(booking.paymentStatus==="paid"){
        booking.paymentStatus="refunded";
    }else{
        booking.paymentStatus="failed";
    }
    booking.expiresAt = null;

    await booking.save();
    return booking;
};