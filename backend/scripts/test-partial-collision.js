require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Show = require("../src/models/Show");
const Seat = require("../src/models/Seat");
const User = require("../src/models/User");
const Booking = require("../src/models/Booking");
const ShowSeat = require("../src/models/ShowSeat");
const bookingService = require("../src/services/bookingService");

async function runPartialCollisionTest() {
    console.log("=================================================");
    console.log("🔥 TESTING PARTIAL insertMany COLLISION (multi-seat)");
    console.log("=================================================");

    try {
        await connectDB();
        await ShowSeat.init();

        // 1. Test user
        let user = await User.findOne({ email: "concurrency_test@example.com" });
        if (!user) {
            user = await User.create({
                name: "Test Runner",
                email: "concurrency_test@example.com",
                password: "password123",
                role: "user"
            });
        }

        // "Other" user who owns the pre-existing lock on seatB
        let otherUser = await User.findOne({ email: "other_user@example.com" });
        if (!otherUser) {
            otherUser = await User.create({
                name: "Other User",
                email: "other_user@example.com",
                password: "password123",
                role: "user"
            });
        }

        // 2. Find/prepare a show
        const now = new Date();
        let show = await Show.findOne({ status: "scheduled", startTime: { $gt: now } });
        if (!show) {
            show = await Show.findOne();
            show.startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
            show.endTime = new Date(show.startTime.getTime() + 150 * 60 * 1000);
            show.status = "scheduled";
            await show.save();
        }
        if (!show) {
            console.error("❌ No show found. Seed one first.");
            process.exit(1);
        }

        // 3. Get 3 seats on this show's screen
        let allSeats = await Seat.find({ screenId: show.screenId, isActive: true }).limit(3);
        if (allSeats.length < 3) {
            console.log("⚠️ Not enough seats. Generating test seats...");
            const dummySeats = Array.from({ length: 3 }, (_, i) => ({
                screenId: show.screenId,
                row: "B",
                number: i + 1,
                type: "regular",
                isActive: true
            }));
            allSeats = await Seat.insertMany(dummySeats);
        }
        const [seatA, seatB, seatC] = allSeats;

        // Clean slate for these 3 seats
        await ShowSeat.deleteMany({ showId: show._id, seatId: { $in: [seatA._id, seatB._id, seatC._id] } });
        await Booking.deleteMany({ showId: show._id, seats: { $in: [seatA._id, seatB._id, seatC._id] } });

        console.log(`🎯 Show: ${show._id}`);
        console.log(`🎯 Seats: A=${seatA._id} B=${seatB._id} C=${seatC._id}`);

        // 4. Pre-create a real "other" booking that legitimately owns seatB
        const otherBooking = await Booking.create({
            userId: otherUser._id,
            showId: show._id,
            seats: [seatB._id],
            totalAmount: 100,
            status: "pending",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await ShowSeat.create({
            showId: show._id,
            seatId: seatB._id,
            bookingId: otherBooking._id,
            status: "locked",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        console.log(`🔒 Pre-locked seatB via a separate booking (${otherBooking._id})`);

        // 5. Attempt to book all 3 seats — seatB collision should abort the whole thing
        const seatIds = [seatA._id, seatB._id, seatC._id];

        try {
            const result = await bookingService.createBooking({
                userId: user._id,
                showId: show._id,
                seatIds
            });
            console.log("❌ FAILED — booking should have been rejected, but succeeded:", result._id);
        } catch (err) {
            console.log("✅ Correctly rejected:", err.message);
        }

        // 6. Check for orphaned ShowSeat locks on A or C
        const leftoverLocks = await ShowSeat.find({
            showId: show._id,
            seatId: { $in: [seatA._id, seatC._id] }
        });

        console.log(
            leftoverLocks.length === 0
                ? "✅ No orphaned locks — cleanup worked"
                : `❌ Orphaned locks found (${leftoverLocks.length}):`,
            leftoverLocks.length === 0 ? "" : leftoverLocks
        );

        // 7. Check for a dangling Booking document (the failed attempt's own booking)
        const danglingBooking = await Booking.findOne({
            showId: show._id,
            seats: { $in: seatIds },
            userId: user._id,
            status: { $ne: "confirmed" }
        });

        console.log(danglingBooking ? "❌ Dangling booking found: " + danglingBooking._id : "✅ No dangling booking");

        console.log("\n---------------- TEST RESULT ----------------");
        const passed = leftoverLocks.length === 0 && !danglingBooking;
        console.log(passed ? "🏆 PASSED — partial collision cleanup works correctly" : "❌ FAILED — see above");
        console.log("----------------------------------------------\n");

    } catch (error) {
        console.error("❌ Test crashed:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

runPartialCollisionTest();