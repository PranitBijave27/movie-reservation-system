const Theater = require("../models/Theater");
const AppError=require("../utils/AppError");

exports.createTheater = async (data) => {
  const theater = await Theater.create(data);
  return theater;
};

exports.getTheaters = async () => {
  return await Theater.find({ status:"active" })
                      .sort({ createdAt:-1 });
};

exports.getTheaterById = async (id) => {
  const theater = await Theater.findById(id);
  if(!theater)
    throw new AppError("Theater not found", 404);          
  return theater;

};
