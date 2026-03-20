const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema=new mongoose.Schema(
{
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // prevent password from returning in query by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save",async function () {
    //avoid rehashing if not changed
    if(!this.isModified("password")) return ;
    try{
      // salt generation 
    const salt = await bcrypt.genSalt(11);
    this.password = await bcrypt.hash(this.password, salt);
    }catch (err) {
    throw new Error("Password hashing failed: " + err.message);
  }
});

//method to compare login password with hashed once
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);