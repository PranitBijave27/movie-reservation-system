const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  showId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Show",
    required:true
  },

  seats:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Seat",
      required:true
    }
  ],

  totalAmount:{
    type:Number,
    required:true,
    min:0
  },

  //is booking successfull or not
  status:{
    type:String,
    enum:["pending","confirmed","cancelled","expired"],
    default:"pending"
  },

  paymentStatus:{
    type:String,
    enum:["pending","paid","failed"],
    default:"pending"
  },

  expiresAt:{
    type:Date
  }
},
{timestamps:true}
);
bookingSchema.index({showId:1,seats:1});

// When booking expires → Mongo automatically deletes it.
bookingSchema.index({expiresAt:1},{expireAfterSeconds:0});


module.exports = mongoose.model("Booking", bookingSchema);
