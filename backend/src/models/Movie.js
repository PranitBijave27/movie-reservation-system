const mongoose = require("mongoose");

const movieSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        index:true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 4000,
    },
    duration: {
      type: Number, // minutes
      required: true,
      min: 1,
    },
    genre: {
      type: [String],
      required: true,
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Sci-Fi",
        "Romance",
        "Thriller",
        "Animation",
        "Documentary",
      ],
    },
    language: {
      type: String,
      required: true,
      lowercase:true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
      default: "",
      match:/^https?:\/\/.+/
    },
    status:{
    type:String,
    enum:["active","inactive","archived"],
    default:"active"
    },
    rating:{
    type:Number,
     min:0,
     max:10,
     default:0
    }
  },
  { timestamps: true }
);

module.exports=mongoose.model("Movie",movieSchema);