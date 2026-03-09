const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req,res,next)=>{
  try{
    const header = req.headers.authorization;

    if(!header || !header.toLowerCase().startsWith("bearer "))
      return res.status(401).json({error:"Unauthorized"});

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if(!user)
      throw new Error("User not found");

    req.user = user;
    next();

  }catch(err){
    res.status(401).json({error:"Invalid token"});
  }
};

module.exports = authMiddleware;
