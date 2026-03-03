const authService = require("../services/authService");
const wrapAsync = require("../utils/wrapAsync");

exports.register = wrapAsync(async (req,res,next)=>{
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
});

exports.login =wrapAsync( async (req,res,next)=>{
    const {email,password} = req.body;
    const result = await authService.loginUser(email,password);
    res.json(result);
});
