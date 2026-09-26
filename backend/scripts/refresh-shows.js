const mongoose = require("mongoose");

async function refreshShows() {
    await mongoose.connect("mongodb://127.0.0.1:27017/movieDB");
    const Show = mongoose.connection.collection("shows");
    const shows = await Show.find().toArray();

    const now = new Date();
    for (let i = 0; i < shows.length; i++) {
        // Schedule show i starting at + (i + 1) * 4 hours from now
        const start = new Date(now.getTime() + (i + 1) * 4 * 60 * 60 * 1000);
        const end = new Date(start.getTime() + 150 * 60 * 1000);
        await Show.updateOne(
            { _id: shows[i]._id },
            { $set: { startTime: start, endTime: end, status: "scheduled" } }
        );
        console.log(`Updated show ${shows[i]._id} to ${start.toISOString()} (status: scheduled)`);
    }

    // Also clear any lingering test locks from completed past shows
    const ShowSeat = mongoose.connection.collection("showseats");
    const cleared = await ShowSeat.deleteMany({ status: "locked" });
    console.log(`Cleared ${cleared.deletedCount} old locked seats.`);

    process.exit(0);
}

refreshShows().catch(err => {
    console.error(err);
    process.exit(1);
});
