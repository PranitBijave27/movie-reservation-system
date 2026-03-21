const Movie=require("../models/Movie");
const AppError=require("../utils/AppError");

exports.createMovie=async(data)=>{
    const movie=await Movie.create(data);
    return movie;
}

exports.getAllMovies=async()=>{
    return await Movie.find({status:"active"})
                      .sort({createdAt:-1}); // newest first means descending order
}

exports.getMovieById=async(id)=>{
    const movie=await Movie.findById(id);
    if(!movie){
        throw new AppError("Movie not found", 404);            
    }
    return movie;
}

exports.archiveMovie=async(id)=>{
    const movie=await Movie.findByIdAndUpdate(
        id,
        {status:"archived"},
        { new: true }
    );
    if(!movie) {
        throw new AppError("Movie not found", 404);            
    }
    return movie;
}

exports.searchMovies =async(query)=>{
    if(!query || query.trim() === "")
    throw new AppError("Search query is required", 400);
    
    const movies = await Movie.find({
        title: { $regex: query, $options: "i" },
        status: "active"
    });

  if(movies.length === 0) throw new AppError("No movies found", 404);
  return movies;
};
