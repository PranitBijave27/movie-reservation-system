const screenService = require("../services/screenService");
const wrapAsync = require("../utils/wrapAsync");


exports.createScreen =wrapAsync( async (req,res,next)=>{
    const screen = await screenService.createScreen(req.body);
    res.status(201).json(screen);
});
