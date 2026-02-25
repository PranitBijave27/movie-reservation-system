const screenService = require("../services/screenService");


exports.createScreen = async (req,res,next)=>{
  try{
    const screen = await screenService.createScreen(req.body);
    res.status(201).json(screen);
  }catch(err){
    next(err);
  }
};
