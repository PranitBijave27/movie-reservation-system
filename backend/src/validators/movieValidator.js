const Joi = require("joi");
const validate = require("../utils/validate");

const movieSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.min": "Title cannot be empty",
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Title is required"
    }),

  description: Joi.string()
    .min(10)
    .max(4000)
    .required()
    .messages({
      "string.min": "Description must be at least 10 characters",
      "any.required": "Description is required"
    }),

  duration: Joi.number()
    .integer()
    .min(1)
    .max(600)
    .required()
    .messages({
      "number.min": "Duration must be at least 1 minute",
      "number.max": "Duration cannot exceed 600 minutes",
      "any.required": "Duration is required"
    }),

  genre: Joi.array()
    .items(Joi.string().valid("Action","Comedy","Drama","Horror","Romance","Thriller","Sci-Fi","Animation","Documentary"))
    .min(1)
    .required()
    .messages({
      "any.required": "Genre is required",
      "array.min": "At least one genre is required"
    }),

  language: Joi.string()
    .required()
    .lowercase()
    .messages({
      "any.required": "Language is required"
    }),

  releaseDate: Joi.date()
    .required()
    .messages({
      "any.required": "Release date is required"
    }),

  posterUrl: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "Poster URL must be a valid URL"
    }),

  status: Joi.string()
    .valid("active", "inactive", "archived")
    .required()
    .messages({
      "any.only": "Status must be upcoming, active or inactive",
      "any.required": "Status is required"
    }),

  rating: Joi.number()
    .min(0)
    .max(10)
    .optional()
    .messages({
      "number.min": "Rating must be between 0 and 10",
      "number.max": "Rating must be between 0 and 10"
    })
});

exports.validateMovie = validate(movieSchema);