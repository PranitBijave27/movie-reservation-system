const showService = require("../services/showService");
const wrapAsync=require("../utils/wrapAsync");

exports.createShow=wrapAsync(async (req,res,next)=>{
      const show =await showService.createShow(req.body);
      res.status(201).json(show);
});

exports.getShowsByMovie =wrapAsync( async (req,res,next)=>{
    const shows = await showService.getShowsByMovie(req.params.movieId);
    res.json(shows);
});
