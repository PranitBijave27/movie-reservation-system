const bookingService = require("../services/bookingService");
const wrapAsync=require("../utils/wrapAsync");

exports.createBooking = wrapAsync(async (req,res,next)=>{
    const booking = await bookingService.createBooking({
      userId: req.user._id ,  
      showId: req.body.showId,
      seatIds: req.body.seatIds
    });
    res.status(201).json(booking);
});

exports.getBookedSeats = wrapAsync(async (req,res)=>{
    const seats = await bookingService.getBookedSeats(req.params.showId);
    res.json(seats);
});

exports.getSeatAvailabilty=wrapAsync(async(req,res)=>{
    const seats=await bookingService.getSeatAvailabilty(req.params.showId);
    res.json(seats);
});

exports.confirmBooking =wrapAsync( async (req,res)=>{
    const booking = await bookingService.confirmBooking(
        req.params.bookingId,
        req.user._id
    );
    res.json(booking);
});

exports.cancelBooking = wrapAsync(async (req,res)=>{
  const booking = await bookingService.cancelBooking(
    req.params.bookingId,
    req.user._id
);
  res.status(200).json({
        status: "success",
        message: "Booking has been cancelled and seats released.",
        data: {
            booking: booking
        }
    });
});


exports.getMyBookings=wrapAsync(async (req,res)=>{
    const userId=req.user._id;
    
    if (!userId) {
        throw new Error("User identification is required to view bookings.");
    }
    const bookings=await bookingService.getUserBookings(userId);
    res.json(bookings);
});