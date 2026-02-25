const Screen = require("../models/Screen");
const Theater = require("../models/Theater");
const Seat = require("../models/Seat");

exports.createScreen = async (data) => {
    const { theaterId, name, rows, seatsPerRow, layoutType } = data;

  // verifing theater exists
  const theater = await Theater.findById(theaterId);
  if (!theater){
    throw new Error("Theater not found");
  }
 // calculate total seats
  const totalSeats = rows.length * seatsPerRow;

  const screen=await Screen.create({
    theaterId,
    name,
    totalSeats,
    layoutType
  });
  //seat generation
  const seats=[];
    for(let row of rows){
        for(let num=1;num<=seatsPerRow;num++){
            seats.push({
                screenId:screen._id,
                row,
                number:num
            });
        }
    }
    await Seat.insertMany(seats);
    return screen;
}

