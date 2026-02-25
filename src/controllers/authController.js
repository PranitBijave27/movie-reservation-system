const authService = require("../services/authService");

exports.register = async (req,res,next)=>{
  try{
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  }catch(err){
    next(err);
  }
};

exports.login = async (req,res,next)=>{
  try{
    const {email,password} = req.body;
    const result = await authService.loginUser(email,password);
    res.json(result);
  }catch(err){
    next(err);
  }
};
