const showService = require("../services/showService");
const wrapAsync=require("../utils/wrapAsync");

exports.createShow=wrapAsync(async (req,res,next)=>{
    const show =await showService.createShow(req.body);
    res.status(201).json({
        success: true,
        message: "Show created successfully",
        data: show
  });
});

exports.getShowsByMovie =wrapAsync( async (req,res,next)=>{
    const shows = await showService.getShowsByMovie(req.params.movieId);
    res.status(200).json({
        success: true,
        message: "Shows fetched successfully",
        data: shows
  });
});

exports.getShowById = wrapAsync(async (req,res,next) => {
    const show = await showService.getShowById(req.params.id);
    res.status(200).json({
        success: true,
        message: "Show fetched successfully",
        data: show
  });
});

exports.recommendSeats = wrapAsync(async (req, res) => {
  const { count, type, budget, request } = req.query;
  const recommendation = await showService.recommendSeats(
    req.params.showId,
    { count, type, budget, request }
  );
  res.status(200).json({
    success: true,
    message: "Seat recommendation generated successfully",
    data: recommendation
  });
});