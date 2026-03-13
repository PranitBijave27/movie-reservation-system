const Screen = require("../models/Screen");
const Theater = require("../models/Theater");
const Seat = require("../models/Seat");
const mongoose = require("mongoose");

exports.createScreen = async (data) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { theaterId, name, rows, seatsPerRow, layoutType } = data;

		// verifing theater exists
		const theater = await Theater.findById(theaterId);
		if (!theater) throw new Error("Theater not found");

		const existing = await Screen.findOne({ theaterId, name });
		if (existing) throw new Error("Screen name already exists in this theater");

		// total seats
		const totalSeats = rows.length * seatsPerRow;

		const screen = new Screen({
			theaterId,
			name,
			totalSeats,
			layoutType,
		});
		await screen.save({session});

		//seat generation
		const seats = [];
		for (let row of rows) {
			for (let num = 1; num <= seatsPerRow; num++) {
				seats.push({
					screenId: screen._id,
					row: row.name,
					number: num,
					type: row.type,
				});
			}
		}
		
		await Seat.insertMany(seats);
		await session.commitTransaction();
    	session.endSession();
		
		return screen;
	} catch (error) {
		await session.abortTransaction();
    	session.endSession();
		throw error;
	 }
};
