const Joi = require("joi");
const validate = require("../utils/validate");

const showSchema = Joi.object({
  movieId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "Invalid movie id",
      "string.length": "Invalid movie id",
      "any.required": "Movie id is required"
    }),

  screenId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "Invalid screen id",
      "string.length": "Invalid screen id",
      "any.required": "Screen id is required"
    }),

  startTime: Joi.date()
    .greater("now") //preventing creating show in past
    .required()
    .messages({
      "date.greater": "Start time must be in the future",
      "any.required": "Start time is required"
    }),

  basePrice: Joi.number()
    .min(1)
    .max(10000)
    .required()
    .messages({
      "number.min": "Base price must be at least 1",
      "number.max": "Base price cannot exceed 10000",
      "any.required": "Base price is required"
    })
});

exports.validateShow = validate(showSchema);