const showService = require("../services/showService");

exports.createShow=async (req,res,next)=>{
    try{
        const show =await showService.createShow(req.body);
        res.status(201).json(show);
    }catch(err){
        next(err);
    }
};

exports.getShowsByMovie = async (req,res,next)=>{
  try{
    const shows = await showService.getShowsByMovie(req.params.movieId);
    res.json(shows);
  }catch(err){
    next(err);
  }
};
