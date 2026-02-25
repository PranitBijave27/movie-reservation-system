const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req,res,next)=>{
  try{
    const header = req.headers.authorization;

    if(!header || !header.startsWith("Bearer"))
      return res.status(401).json({msg:"No token"});

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();

  }catch(err){
    res.status(401).json({msg:"Invalid token"});
  }
};

module.exports = authMiddleware;
