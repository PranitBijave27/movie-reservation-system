const theaterService = require("../services/theaterService");
const wrapAsync=require("../utils/wrapAsync");

exports.createTheater = wrapAsync(async (req,res,next)=>{
    const theater = await theaterService.createTheater(req.body);
    res.status(201).json(theater);
});

exports.getTheaters = wrapAsync(async (req,res,next)=>{
    const theaters = await theaterService.getTheaters();
    res.json(theaters);
});

exports.getTheater = wrapAsync(async (req,res,next)=>{
    const theater = await theaterService.getTheaterById(req.params.id);
    res.json(theater);
});