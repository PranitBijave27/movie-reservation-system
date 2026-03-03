const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true,
    trim:true
  },

  //reference to theater ud foreign key
  theaterId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Theater",
    required:true
  },

  totalSeats:{
    type:Number,
    required:true,
    min:1
  },

  layoutType:{
    type:String,
    enum:["classic","premium","recliner"],
    default:"classic"
  },

  status:{
    type:String,
    enum:["active","inactive","maintenance"],
    default:"active"
  }
},
{timestamps:true}
);

module.exports = mongoose.model("Screen", screenSchema);
