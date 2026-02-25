const Movie=require("../models/Movie");

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
        throw new Error("movie not found");
    }
    return movie;
}

exports.archiveMovie=async(id)=>{
    const movie=await Movie.findByIdAndUpdate(
        id,
        {status:"archived"},
        { returnDocument: 'after' }
    );
    if(!movie) {
        throw new Error("Movie not found");
    }
}

