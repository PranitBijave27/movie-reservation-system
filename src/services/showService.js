const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Screen = require("../models/Screen");

//cleanup time for hall
const CLEANING_BUFFER=20;

exports.createShow = async (data) => {
  const { movieId, screenId, startTime, basePrice } = data;
  const movie=await Movie.findById(movieId);
    if(!movie){
        throw new Error("Movie not found");
    }
    const screen=await Screen.findById(screenId);
    if(!screen){
        throw new Error("Screen not found");
    }
    const start=new Date(startTime);
    const end=new Date(start+ (movie.duration+CLEANING_BUFFER) *60000);

    const overlapping=await Show.findOne({
        screenId,
        status:"scheduled",
        $or:[
            {
                startTime:{$lt:end},
                endTime:{$gt:start}
            }
        ]
    });

    if(overlapping){
        throw new Error("Show timing overlaps with existing show");
    }
    const show =await Show.create({
        movieId,
        screenId,
        startTime:start,
        endTime:end,
        basePrice
    });
    return show;
};


exports.getShowsByMovie=async (movieId)=>{
    return await Show.find({
        movieId,
        status:"scheduled"
    }).populate("screenId")
      .sort({startTime:1});
};