const movieService = require("../services/movieService");

exports.creatMovie=async(req,res,next)=>{
    try{
        const movie=await movieService.createMovie(req.body);
        return res.json(movie);
    }catch(err){
        next(err);
    }
};

exports.getMovies=async(req,res,next)=>{
    try{
        const movies=await movieService.getAllMovies();
        res.json(movies);
    }catch(err){
        next(err);
    }
}

exports.getMovie=async(req,res,next)=>{
    try{
        const movie=await movieService.getMovieById(req.params.id);
        res.json(movie);
    }catch(err){
        next(err);
    }
}

exports.archiveMovie=async(req,res,next)=>{
    try{
        const movie=await movieService.archiveMovie(req.params.id);
        res.json(movie);
    }catch(err){
        next(err);
    }
}