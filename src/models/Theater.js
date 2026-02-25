const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true,
    trim:true,
    maxlength:100
  },

  city:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    index:true
  },

  address:{
    type:String,
    required:true,
    trim:true,
    maxlength:300
  },

  screensCount:{
    type:Number,
    required:true,
    min:1
  },

  status:{
    type:String,
    enum:["active","inactive","maintenance"],
    default:"active"
  }
},
{timestamps:true}
);

module.exports = mongoose.model("Theater", theaterSchema);
