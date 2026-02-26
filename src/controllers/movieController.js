const movieService = require("../services/movieService");
const wrapAsync = require("../utils/wrapAsync");

exports.creatMovie=wrapAsync(async(req,res,next)=>{
    const movie=await movieService.createMovie(req.body);
    return res.json(movie);
});

exports.getMovies= wrapAsync(async(req,res,next)=>{
    const movies=await movieService.getAllMovies();
    res.json(movies);
});

exports.getMovie=wrapAsync(async(req,res,next)=>{
    const movie=await movieService.getMovieById(req.params.id);
    res.json(movie);
});

exports.archiveMovie=wrapAsync(async(req,res,next)=>{
    const movie=await movieService.archiveMovie(req.params.id);
    res.json(movie);
});