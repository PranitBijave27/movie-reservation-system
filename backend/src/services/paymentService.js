
const simulatePayment=async({amount,userId,bookingId})=>{
    await new Promise(resolve=>{
        const isSuccess=Math.random() <0.9;
        if(isSuccess){
            return {
                success:true,
                amount
            }
        }else{
            return {
                success: false,
                error: 'Payment declined'
            };
        }
    })
};

module.exports={simulatePayment};