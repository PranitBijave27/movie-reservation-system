const cron=require("node-cron");
const Booking=require("../models/Booking");
const Show=require("../models/Show");

const startAutomation=()=>{
    cron.schedule("* * * * *",async()=>{
        const now=new Date();
        await Booking.updateMany(
            {
                status:"pending",
                expiresAt:{$lt:now}
            },
            {
                status:"expired",
                paymentStatus:"failed"
            }
        );
        await Show.updateMany(
            {
                status:"scheduled",
                endTime:{$lt:now}
            },
            {
                status:"completed"
            }
        );
        console.log("Automation check completed");
    });
};

module.exports=startAutomation;