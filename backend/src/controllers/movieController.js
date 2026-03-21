const movieService = require("../services/movieService");
const wrapAsync = require("../utils/wrapAsync");
const AppError=require("../utils/AppError");

exports.creatMovie = wrapAsync(async (req, res, next) => {
  const movie = await movieService.createMovie(req.body);
  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: movie,
  });
});

exports.getMovies = wrapAsync(async (req, res, next) => {
  const movies = await movieService.getAllMovies();
  res.status(200).json({
    success: true,
    message: "Movies fetched successfully",
    data: movies,
  });
});

exports.getMovie = wrapAsync(async (req, res, next) => {
  const movie = await movieService.getMovieById(req.params.id);
  res.status(200).json({
    success: true,
    message: "Movie fetched successfully",
    data: movie,
  });
});

exports.archiveMovie = wrapAsync(async (req, res, next) => {
  const movie = await movieService.archiveMovie(req.params.id);
  res.status(200).json({
    success: true,
    message: "Movie archived successfully",
    data: movie,
  });
});

exports.searchMovies = wrapAsync(async (req, res) => {
  const movies = await movieService.searchMovies(req.query.title);
  res.status(200).json({
    success: true,
    message: "Movies fetched successfully",
    data: movies,
  });
});