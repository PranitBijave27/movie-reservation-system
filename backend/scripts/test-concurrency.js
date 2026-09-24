require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Show = require("../src/models/Show");
const Seat = require("../src/models/Seat");
const User = require("../src/models/User");
const Booking = require("../src/models/Booking");
const ShowSeat = require("../src/models/ShowSeat");
const bookingService = require("../src/services/bookingService");

async function runConcurrencyStressTest() {
  console.log("=================================================");
  console.log("🔥 STARTING CONCURRENCY & DOUBLE-BOOKING STRESS TEST");
  console.log("=================================================");

  try {
    await connectDB();
    await ShowSeat.init(); // Ensure compound unique indexes are built on MongoDB

    // 1. Find or create a test user
    let user = await User.findOne({ email: "concurrency_test@example.com" });
    if (!user) {
      user = await User.create({
        name: "Test Runner",
        email: "concurrency_test@example.com",
        password: "password123",
        role: "user"
      });
    }

    // 2. Find an existing scheduled show with valid future start time
    const now = new Date();
    let show = await Show.findOne({
      status: "scheduled",
      startTime: { $gt: now }
    });

    if (!show) {
      console.log("⚠️ No upcoming scheduled show found. Looking for any show to use for test...");
      show = await Show.findOne();
      if (show) {
        // Temporarily adjust startTime and endTime for testing
        show.startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        show.endTime = new Date(show.startTime.getTime() + 150 * 60 * 1000);
        show.status = "scheduled";
        await show.save();
      }
    }

    if (!show) {
      console.error("❌ No show found in database to run concurrency test against. Please seed a show first.");
      process.exit(1);
    }

    // 3. Find an available seat for this show
    let allSeats = await Seat.find({ screenId: show.screenId, isActive: true });
    if (allSeats.length === 0) {
      console.log("⚠️ No seats found for this screen. Generating test seats...");
      const dummySeats = Array.from({ length: 10 }, (_, i) => ({
        screenId: show.screenId,
        row: "A",
        number: i + 1,
        type: "regular",
        isActive: true
      }));
      allSeats = await Seat.insertMany(dummySeats);
    }

    const occupiedSeatIds = (await ShowSeat.find({ showId: show._id })).map(s => s.seatId.toString());
    const availableSeat = allSeats.find(s => !occupiedSeatIds.includes(s._id.toString()));

    const targetSeat = availableSeat || allSeats[0];
    await ShowSeat.deleteMany({ showId: show._id, seatId: targetSeat._id });
    await Booking.deleteMany({ showId: show._id, seats: targetSeat._id });

    console.log(`🎯 Target Show ID: ${show._id}`);
    console.log(`🎯 Target Seat: Row ${targetSeat.row}-${targetSeat.number} (ID: ${targetSeat._id})`);

    const CONCURRENT_REQUESTS = 500;
    console.log(`⚡ Dispatching ${CONCURRENT_REQUESTS} simultaneous booking requests at the EXACT same millisecond...`);

    // Prepare 500 concurrent promises attempting to book the exact same seat
    const promises = Array.from({ length: CONCURRENT_REQUESTS }, (_, index) => {
      return bookingService.createBooking({
        userId: user._id,
        showId: show._id,
        seatIds: [targetSeat._id]
      });
    });

    const startTime = Date.now();
    const results = await Promise.allSettled(promises);
    const durationMs = Date.now() - startTime;

    let successCount = 0;
    let conflictCount = 0;
    let otherErrorCount = 0;

    results.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        successCount++;
        console.log(`  [Worker ${idx + 1}] ✅ 201 Created (Booking ID: ${res.value._id})`);
      } else {
        if (res.reason.statusCode === 409 || res.reason.message.includes("taken") || res.reason.message.includes("booked")) {
          conflictCount++;
          console.log(`  [Worker ${idx + 1}] 🛡️ 409 Conflict: ${res.reason.message}`);
        } else {
          otherErrorCount++;
          console.log(`  [Worker ${idx + 1}] ❌ Error: ${res.reason.message}`);
        }
      }
    });

    // Verify in database how many bookings & locks actually exist
    const actualLocksInDB = await ShowSeat.countDocuments({
      showId: show._id,
      seatId: targetSeat._id
    });

    console.log("\n---------------- TEST RESULTS ----------------");
    console.log(`Total Concurrent Attempts: ${CONCURRENT_REQUESTS}`);
    console.log(`Execution Duration:       ${durationMs}ms`);
    console.log(`Successful Bookings:       ${successCount}`);
    console.log(`Conflicts Blocked (409):   ${conflictCount}`);
    console.log(`Other Errors:              ${otherErrorCount}`);
    console.log(`Actual Locks in DB:        ${actualLocksInDB}`);
    console.log(`Double Booking Rate:       ${((actualLocksInDB - 1) / CONCURRENT_REQUESTS) * 100}%`);
    console.log("----------------------------------------------\n");

    if (successCount === 1 && actualLocksInDB === 1 && conflictCount === (CONCURRENT_REQUESTS - 1)) {
      console.log("🏆 VERIFICATION SUCCESSFUL: 0% DOUBLE BOOKINGS!");
      console.log("The unique compound index successfully prevented concurrent double booking.\n");
    } else {
      console.error("❌ TEST FAILED: Race condition was not prevented properly.");
    }

  } catch (error) {
    console.error("❌ Test crashed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runConcurrencyStressTest();
