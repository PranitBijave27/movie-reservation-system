const Joi = require("joi");
const validate = require("../utils/validate");

const bookingSchema = Joi.object({
  showId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "Invalid show id",
      "string.length": "Invalid show id",
      "any.required": "Show id is required"
    }),

  seatIds: Joi.array()
    .items(
      Joi.string()
        .hex()
        .length(24)
        .messages({
          "string.hex": "Invalid seat id",
          "string.length": "Invalid seat id"
        })
    )
    .min(1)
    .max(10)
    .required()
    .messages({
      "array.min": "At least one seat is required",
      "array.max": "Cannot book more than 10 seats at once",
      "any.required": "Seat ids are required"
    })
});

exports.validateBooking = validate(bookingSchema);