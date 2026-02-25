const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  movieId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Movie",
    required:true
  },

  screenId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Screen",
    required:true
  },

  startTime:{
    type:Date,
    required:true
  },

  endTime:{
    type:Date,
    required:true
  },

  basePrice:{
    type:Number,
    required:true,
    min:0
  },

  status:{
    type:String,
    enum:["scheduled","cancelled","completed"],
    default:"scheduled"
  }
},
{timestamps:true}
);

showSchema.index({screenId:1,startTime:1},{unique:true});

module.exports = mongoose.model("Show", showSchema);
