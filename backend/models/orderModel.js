import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    products: [
        {
           productId : {type: mongoose.Schema.Types.ObjectId, ref:"Product", required: true},
           quantity: {type:Number, required: true}
        }
    ],
    amount:{type:Number, required: true},
    tax:{type:Number, required: true},
    shipping:{type:Number, required: true},
    currency:{type:String, default:"INR"},
    status:{type:String, enum:["Pending", "Paid", "Failed"], default:"Pending"},
    fulfillmentStatus:{
        type:String,
        enum:["Awaiting Payment", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
        default:"Awaiting Payment"
    },

    //Razorpay fields
    razorpayOrderId:{type: String},
    razorpayPaymentId:{type: String},
    razorpaySignature:{type: String}
},{timestamps:true});

export const Order = mongoose.model("Order", orderSchema)
