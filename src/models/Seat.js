const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
{
  screenId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Screen",
    required:true
  },

  row:{
    type:String,
    required:true,
    uppercase:true
  },

  number:{
    type:Number,
    required:true,
    min:1
  },

  type:{
    type:String,
    enum:["regular","premium","vip"],
    default:"regular"
  },

  isActive:{
    type:Boolean,
    default:true
  }
},
{timestamps:true}
);
// Compound Index -> Without this, we could accidentally save two "Seat A-1" documents for the same screen
seatSchema.index({screenId:1,row:1,number:1},{unique:true});

module.exports = mongoose.model("Seat", seatSchema);
