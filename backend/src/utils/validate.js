const validate=(schema)=>(req,res,next)=>{
    const {error}=schema.validate(req.body,{abortEarly:false}); // returns all validation error at once
    if(error){
        return res.status(400).json({
            success: false,
            message: error.details.map(d => d.message).join(", "),
            data: null
        });
    }
    next();
}
module.exports=validate;