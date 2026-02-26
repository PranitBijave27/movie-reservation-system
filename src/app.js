require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const User = require("./models/User");
const Movie = require("./models/Movie");
const movieRoutes=require("./routes/movieRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const screenRoutes = require("./routes/screenRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.json({data:"API Running"});
});
app.use("/api/movies",movieRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);


app.use((err,req,res,next)=>{
  res.status(400).json({
    error:err.message
  });
});


const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    // 1.db connection
    await connectDB();
    //2 start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }catch (error) {
    // 3. If the DB fails
    console.error("Failed to start server:", error.message);
  }
}
startServer();