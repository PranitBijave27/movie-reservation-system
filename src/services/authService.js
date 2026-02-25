const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (data) => {
  const { name, email, password } = data;

  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return { user, token };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid credentials");

  const match = await user.comparePassword(password);
  if (!match) throw new Error("Invalid credentials");
  const token = generateToken(user._id);

  return { user, token };
};
