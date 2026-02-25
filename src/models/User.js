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
      //the password field will be hidden by default when we query USer.find();
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  //automatically adds createdAt and updatedAt in DB .
  { timestamps: true }
);

// Middleware: Runs every time a user document is 'saved'
userSchema.pre("save",async function () {
    // hash the password if it has been modified or its new
    if(!this.isModified("password")) return ;
    try{
      // salt generation 
    const salt = await bcrypt.genSalt(11);
    // overwrite the plain text password with the hashed one
    this.password = await bcrypt.hash(this.password, salt);
    }catch (err) {
    throw new Error("Password hashing failed: " + err.message);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);