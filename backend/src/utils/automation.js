const cron = require("node-cron");
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const ShowSeat = require("../models/ShowSeat");

const startAutomation = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();

            // Find all pending bookings that have expired
            const expiredBookings = await Booking.find({
                status: "pending",
                expiresAt: { $lt: now }
            }).select("_id");

            if (expiredBookings.length > 0) {
                const expiredIds = expiredBookings.map((b) => b._id);

                // 1. Mark bookings as expired
                await Booking.updateMany(
                    { _id: { $in: expiredIds } },
                    {
                        status: "expired",
                        paymentStatus: "failed"
                    }
                );

                // 2. Release seat locks so other users can immediately book them
                await ShowSeat.deleteMany({ bookingId: { $in: expiredIds } });
                console.log(`[Automation] Released seats for ${expiredIds.length} expired bookings.`);
            }

            // Mark completed shows
            await Show.updateMany({
                status: "scheduled",
                endTime: { $lt: now }
            }, {
                status: "completed"
            }
            );
        } catch (error) {
            console.error("[Automation Error]:", error.message);
        }
    });
};

module.exports = startAutomation;