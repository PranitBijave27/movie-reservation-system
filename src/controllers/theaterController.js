const theaterService = require("../services/theaterService");

exports.createTheater = async (req,res,next)=>{
  try{
    const theater = await theaterService.createTheater(req.body);
    res.status(201).json(theater);
  }catch(err){
    next(err);
  }

};

exports.getTheaters = async (req,res,next)=>{
  try{
    const theaters = await theaterService.getTheaters();
    res.json(theaters);
  }catch(err){
    next(err);
  }
};

exports.getTheater = async (req,res,next)=>{
  try{
    const theater = await theaterService.getTheaterById(req.params.id);
    res.json(theater);
  }catch(err){
    next(err);
  }
};