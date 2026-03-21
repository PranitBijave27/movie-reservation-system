const Seat=require("../models/Seat");
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const {simulatePayment}=require("../services/paymentService");
const AppError=require("../utils/AppError");
const mongoose=require("mongoose");

exports.createBooking = async ({ userId, showId, seatIds }) => {

    const session =await mongoose.startSession();
    session.startTransaction();
    try{

        if(seatIds.length>10){
            throw new AppError("More than 10 seats not allowed", 400);
        }
        const show = await Show.findById(showId).session(session); // show verification

        if(!show){
            throw new AppError("Show not found", 404);             
        }

        if(show.status !== "scheduled")
            throw new AppError("Show not available", 400);         

        if(show.startTime <=new Date()) {
            throw new AppError("Show already started or completed", 400);       
        }
        
        const seats=await Seat.find({
            _id:{$in:seatIds},
            screenId:show.screenId,
            isActive:true
        }).session(session);

        if (seats.length !== seatIds.length)
            throw new AppError("Invalid seats selected", 400);     

        const existing = await Booking.findOne({
            showId,
            seats: { $in: seatIds },
            status: { $in: ["pending","confirmed"] } //Pending These are seats currently in someone's "cart"
        }).session(session);

        if (existing)
            throw new AppError("Some seats already booked", 409);

        let totalAmount = seats.reduce((sum, seat) => {
            let multiplier = 1;
            if(seat.type === "premium") multiplier =1.45;
            if(seat.type === "vip") multiplier = 1.75;

            return sum + show.basePrice * multiplier;
        },0);

        totalAmount = Math.ceil(totalAmount);
        
        if (totalAmount % 10 === 0) {
            totalAmount = totalAmount - 1;
        }
        //5 minutes lock for seat
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const booking=await Booking.create(
            [{
            userId,
            showId,
            seats:seatIds,
            totalAmount,
            expiresAt
            }],
            {session}
    );
        await session.commitTransaction();
        session.endSession();

        return booking[0];
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
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
        throw new AppError("Show not found", 404);             
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

exports.confirmBooking = async (bookingId,userId) => {

    const booking = await Booking.findById(bookingId);

    if (!booking)
        throw new AppError("Booking not found", 404);          

    if (booking.status !== "pending")
        throw new AppError("Booking cannot be confirmed", 400);

    if(booking.userId.toString() !== userId.toString())
    throw new AppError("Unauthorized", 403);               

    if (booking.expiresAt && booking.expiresAt < new Date())
        throw new AppError("Booking expired", 400);            

    const payment=await simulatePayment({
        amount:booking.totalAmount,
        userId:booking.userId,
        bookingId:booking._id
    });

    if(!payment.success){
        throw new AppError("Payment failed", 400);             
    }


    booking.status = "confirmed";
    booking.paymentStatus = "paid";
    booking.expiresAt = null;

    await booking.save();
    return booking;
}

exports.cancelBooking = async (bookingId,userId) => {
    const booking = await Booking.findById(bookingId);
    
    if (!booking)
        throw new AppError("Booking not found", 404);          
    if (booking.status === "cancelled")
        throw new AppError("Booking already cancelled", 400);
    if (booking.status === "expired") {
        throw new AppError("Cannot cancel within 2 hours", 400);
    }

    if(booking.userId.toString() !== userId.toString())
        throw new AppError("Unauthorized", 403);               
    
    const show = await Show.findById(booking.showId);

    if (!show)
        throw new AppError("Show not found", 404);

    const currentTime = new Date();
    const showTime = new Date(show.startTime);

    const timeDifference = showTime - currentTime;

    if(timeDifference < 0) throw new Error("Cannot cancel a show that has already started or finished");
    if (timeDifference < 2*60*60*1000) throw new AppError("Cannot cancel within 2 hours", 400);
    
    booking.status = "cancelled";

    if(booking.paymentStatus==="paid"){
        booking.paymentStatus="refunded";
    }
    booking.expiresAt = null;

    await booking.save();
    return booking;
};

exports.getUserBookings =async(userId)=>{
    const bookings =await Booking.find({userId})
        .populate({
            path:"showId",
            populate:[
                {
                    path:"movieId",
                    select:"title duration posterUrl"
                },
                {
                    path:"screenId",
                    populate:{
                        path: "theaterId",
                        select: "name city"
                    }
                }
            ]
        }).populate({
            path:"seats",
            select:"row number"
        }).sort({createdAt:-1});
    return bookings;
}