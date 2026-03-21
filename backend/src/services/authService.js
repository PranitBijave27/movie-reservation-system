const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const AppError =require("../utils/AppError");

exports.registerUser = async (data) => {
  const { name, email, password } = data;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("User already exists", 409);  

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  const userObject = user.toObject();
  delete userObject.password; 

  return { user: userObject, token };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new AppError("Invalid credentials", 401);        

  const match = await user.comparePassword(password);
  if (!match) throw new AppError("User not found", 404);             
  const token = generateToken(user._id);
 
  const userObject = user.toObject();
  delete userObject.password; //prevents password sending to frontend
  return { user: userObject, token };
};
