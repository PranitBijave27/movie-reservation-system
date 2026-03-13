const authService = require("../services/authService");
const wrapAsync = require("../utils/wrapAsync");

exports.register = wrapAsync(async (req,res,next)=>{
    const result = await authService.registerUser(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result
  });
});

exports.login =wrapAsync( async (req,res,next)=>{
    const {email,password} = req.body;
    const result = await authService.loginUser(email,password);
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
    });
});
