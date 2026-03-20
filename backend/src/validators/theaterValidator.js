const Joi = require("joi");
const validate = require("../utils/validate");

const theaterSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.min": "Theater name must be at least 2 characters",
      "string.max": "Theater name cannot exceed 100 characters",
      "any.required": "Theater name is required"
    }),

  city: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min": "City must be at least 2 characters",
      "any.required": "City is required"
    }),

  address: Joi.string()
    .min(5)
    .max(300)
    .required()
    .messages({
      "string.min": "Address must be at least 5 characters",
      "any.required": "Address is required"
    }),

  screensCount: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      "number.min": "At least 1 screen is required",
      "number.max": "Cannot exceed 20 screens",
      "any.required": "Screens count is required"
    }),

  status: Joi.string()
    .valid("active", "inactive", "maintenance")
    .default("active")
    .messages({
      "any.only": "Status must be active, inactive or maintenance"
    })
});

exports.validateTheater = validate(theaterSchema);