const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Screen = require("../models/Screen");
const Seat = require("../models/Seat");
const Booking=require("../models/Booking");
const AppError =require("../utils/AppError");

const getGeminiRecommendation = require("../utils/gemini");

//cleanup time for hall
const CLEANING_BUFFER = 20;

exports.createShow = async (data) => {
  const { movieId, screenId, startTime, basePrice } = data;
  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new AppError("Movie not found", 404);
  }
  const screen = await Screen.findById(screenId);
  if (!screen) {
    throw new AppError("Screen not found", 404);
  }
  const start = new Date(startTime);
  const end = new Date(
    start.getTime() + (movie.duration + CLEANING_BUFFER) * 60000,
  );

  const overlapping = await Show.findOne({
    screenId,
    status: "scheduled",
    $or: [
      {
        startTime: { $lt: end },
        endTime: { $gt: start },
      },
    ],
  });

  if (overlapping) {
    throw new AppError("Show timing overlaps", 409);
  }
  const show = await Show.create({
    movieId,
    screenId,
    startTime: start,
    endTime: end,
    basePrice,
  });
  return show;
};

exports.getShowsByMovie = async (movieId) => {
  return await Show.find({
    movieId,
    status: "scheduled",
  })
    .populate("screenId")
    .sort({ startTime: 1 });
};

exports.getShowById = async (id) => {
  const show = await Show.findById(id);
  if (!show) throw new AppError("Show not found",404);
  return show;
};

exports.recommendSeats = async (showId, preferences) => {
  //Get show details
  const show = await Show.findById(showId)
    .populate("movieId", "title genre")
    .populate("screenId", "name totalSeats");

console.log("Show:", show);
console.log("MovieId:", show?.movieId);
  if (!show) throw new AppError("Show not found",404);

  //Get available seats
  const allSeats = await Seat.find({
    screenId: show.screenId._id,
    isActive: true,
  }).sort({ row: 1, number: 1 });

  // Get booked seats
  const bookings = await Booking.find({
    showId,
    status: { $in: ["pending", "confirmed"] },
  });

  const bookedSeatIds = new Set(
    bookings.flatMap((b) => b.seats.map((id) => id.toString())),
  );
  //Filter available seats only
  const availableSeats = allSeats
    .filter((seat) => !bookedSeatIds.has(seat._id.toString()))
    .map((seat) => ({
      id: seat._id,
      row: seat.row,
      number: seat.number,
      type: seat.type,
    }));

  if (availableSeats.length === 0)
    throw new AppError("No seats available for this show",400);

  //Prompt
  const prompt = ` You are a smart seat recommendation system for a movie theater.
    Movie: ${show.movieId.title}
    Screen: ${show.screenId.name}
    Show Time: ${show.startTime}
    Base Price: ${show.basePrice}
    
    Pricing:
    - Regular seats: ${show.basePrice} per seat
    - Premium seats: ${Math.ceil(show.basePrice * 1.45)} per seat
    - VIP seats: ${Math.ceil(show.basePrice * 1.75)} per seat
    
    Available Seats:
    ${JSON.stringify(availableSeats)}
    
    User Preferences:
    - Number of seats: ${preferences.count || 1}
    - Seat type preference: ${preferences.type || "any"}
    - Budget per seat: ${preferences.budget || "no limit"}
    - Special requests: ${preferences.request || "none"}
    
    Based on the available seats and user preferences, recommend the best seats.
    
    IMPORTANT: Respond ONLY with a valid JSON object in this exact format, no extra text:
    {
      "recommendedSeats": [
        {
          "id": "seat_id",
          "row": "A",
          "number": 1,
          "type": "regular",
          "price": 200
        }
      ],
      "reason": "explanation of why these seats are recommended",
      "totalPrice": 400
    }`;
    const rawResponse = await getGeminiRecommendation(prompt);
    try {
        const clean = rawResponse.replace(/```json|```/g, "").trim();
        return JSON.parse(clean);
    } catch (err) {
        throw new AppError("AI recommendation failed, please try again",500);
    }
};
