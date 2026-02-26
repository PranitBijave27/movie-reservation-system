const bookingService = require("../services/bookingService");
const wrapAsync=require("../utils/wrapAsync");

exports.createBooking = wrapAsync(async (req,res,next)=>{
    const booking = await bookingService.createBooking({
      userId: req.body.userId, // for testing now 
      showId: req.body.showId,
      seatIds: req.body.seatIds
    });
    res.status(201).json(booking);
});

exports.getBookedSeats = wrapAsync(async (req,res,next)=>{
    const seats = await bookingService.getBookedSeats(req.params.showId);
    res.json(seats);
});

exports.getSeatAvailabilty=wrapAsync(async(req,res,next)=>{
    const seats=await bookingService.getSeatAvailabilty(req.params.showId);
    res.json(seats);
});

exports.confirmBooking =wrapAsync( async (req,res,next)=>{
    const booking = await bookingService.confirmBooking(req.params.bookingId);
    res.json(booking);
});