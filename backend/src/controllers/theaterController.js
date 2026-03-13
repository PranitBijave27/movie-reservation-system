const theaterService = require("../services/theaterService");
const wrapAsync=require("../utils/wrapAsync");

exports.createTheater = wrapAsync(async (req,res,next)=>{
    const theater = await theaterService.createTheater(req.body);
    res.status(201).json({
        success:true,
        message: "Theater created successfully",
        data: theater
    });
});

exports.getTheaters = wrapAsync(async (req,res,next)=>{
    const theaters = await theaterService.getTheaters();
    res.status(200).json({
        success: true,
        message: "Theaters fetched successfully",
        data: theaters
  });
});

exports.getTheater = wrapAsync(async (req,res,next)=>{
    const theater = await theaterService.getTheaterById(req.params.id);
    res.status(200).json({
        success: true,
        message: "Theater fetched successfully",
        data: theater
  });
});