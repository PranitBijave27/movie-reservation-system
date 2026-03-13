
const simulatePayment=async({amount,userId,bookingId})=>{
    return new Promise(resolve=>{
        const isSuccess=Math.random() <0.9;
        if(isSuccess){
            resolve({
                success: true,
                amount
            });
        }else{
            resolve({
                success: false,
                error: "Payment declined"
            });
        }
    })
};

module.exports={simulatePayment};