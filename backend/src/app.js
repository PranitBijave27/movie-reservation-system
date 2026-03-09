require("dotenv").config();
const express = require("express");
const cors=require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const movieRoutes=require("./routes/movieRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const screenRoutes = require("./routes/screenRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const startAutomation=require("./utils/automation");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/auth", authRoutes);
app.use("/api/movies",movieRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//error handler
app.use((err,req,res,next)=>{
  res.status(400).json({
    success:false,
    error:err.message
  });
});



const startServer = async () => {
  try {
    // 1.db connection
    await connectDB();

    startAutomation();
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
