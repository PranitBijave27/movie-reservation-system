const bookingService = require("../services/bookingService");

exports.createBooking = async (req,res,next)=>{
  try{
    const booking = await bookingService.createBooking({
      userId: req.body.userId, // for testing now 
      showId: req.body.showId,
      seatIds: req.body.seatIds
    });
    res.status(201).json(booking);
  }catch(err){
    next(err);
  }
};

exports.getBookedSeats = async (req,res,next)=>{
  try{
    const seats = await bookingService.getBookedSeats(req.params.showId);
    res.json(seats);
  }catch(err){
    next(err);
  }
};

exports.getSeatAvailabilty=async(req,res,next)=>{
  try{
    const seats=await bookingService.getSeatAvailabilty(req.params.showId);
    res.json(seats);
  }catch(err){
    next(err);
  }
};

exports.confirmBooking = async (req,res,next)=>{
  try{
    const booking = await bookingService.confirmBooking(req.params.bookingId);
    res.json(booking);
  }catch(err){
    next(err);
  }
};