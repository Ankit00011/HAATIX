import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";

const buildTracking = (order) => {
    const fulfillmentStatus =
        order.fulfillmentStatus ||
        (order.status === "Paid" ? "Processing" : order.status === "Failed" ? "Cancelled" : "Awaiting Payment");

    const currentKey =
        fulfillmentStatus === "Delivered"
            ? "delivered"
            : fulfillmentStatus === "Out for Delivery"
                ? "out_for_delivery"
                : fulfillmentStatus === "Shipped"
                    ? "shipped"
                    : fulfillmentStatus === "Processing"
                        ? "processing"
                        : fulfillmentStatus === "Cancelled"
                            ? "cancelled"
                            : "awaiting_payment";

    const steps = [
        {
            key: "placed",
            label: "Order Placed",
            description: "Your order has been created successfully.",
            completed: true,
            active: currentKey === "placed",
            timestamp: order.createdAt,
        },
        {
            key: "awaiting_payment",
            label: "Payment Review",
            description: order.status === "Pending" ? "We are waiting for payment confirmation." : "Payment confirmation has been recorded.",
            completed: order.status !== "Pending",
            active: currentKey === "awaiting_payment",
            timestamp: order.status === "Pending" ? order.updatedAt : order.createdAt,
        },
        {
            key: "processing",
            label: "Processing",
            description: "We are preparing your items for shipment.",
            completed: ["Shipped", "Out for Delivery", "Delivered"].includes(fulfillmentStatus),
            active: currentKey === "processing",
            timestamp: order.status === "Paid" ? order.updatedAt : null,
        },
        {
            key: "shipped",
            label: "Shipped",
            description: "Your package has left our dispatch center.",
            completed: ["Out for Delivery", "Delivered"].includes(fulfillmentStatus),
            active: currentKey === "shipped",
            timestamp: ["Shipped", "Out for Delivery", "Delivered"].includes(fulfillmentStatus) ? order.updatedAt : null,
        },
        {
            key: "out_for_delivery",
            label: "Out for Delivery",
            description: "Your package is on the way to your address.",
            completed: fulfillmentStatus === "Delivered",
            active: currentKey === "out_for_delivery",
            timestamp: ["Out for Delivery", "Delivered"].includes(fulfillmentStatus) ? order.updatedAt : null,
        },
        {
            key: "delivered",
            label: fulfillmentStatus === "Cancelled" ? "Cancelled" : "Delivered",
            description: fulfillmentStatus === "Cancelled" ? "This order could not be completed." : "Your order has been delivered.",
            completed: ["Delivered", "Cancelled"].includes(fulfillmentStatus),
            active: currentKey === "delivered" || currentKey === "cancelled",
            timestamp: ["Delivered", "Cancelled"].includes(fulfillmentStatus) ? order.updatedAt : null,
        },
    ];

    return {
        status: order.status,
        fulfillmentStatus,
        isOngoing: ["Pending", "Paid"].includes(order.status) && !["Delivered", "Cancelled"].includes(fulfillmentStatus),
        currentStep: currentKey,
        steps,
    };
};

const formatOrdersForResponse = (orders) =>
    orders.map((order) => ({
        ...order.toObject(),
        tracking: buildTracking(order),
    }));

export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body;
        
        // Validate and sanitize amount
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }
        
        // Razorpay test mode limit: ₹50,000
        if (parsedAmount > 50000) {
            console.warn(`Amount ${parsedAmount} exceeds Razorpay test mode limit`);
            return res.status(400).json({ success: false, message: "Amount exceeds maximum limit" });
        }

        const amountInPaise = Math.round(parsedAmount * 100);
        console.log(`Creating order with amount: ${parsedAmount} (${amountInPaise} paise)`);

        const options = {
            amount: amountInPaise,
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);
        const newOrder = new Order({
            user: req.user._id,
            products,
            amount: parsedAmount,
            tax,
            shipping,
            currency,
            status: "Pending",
            fulfillmentStatus: "Awaiting Payment",
            razorpayOrderId: razorpayOrder.id,
        });

        await newOrder.save();

        res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder,
        });
    } catch (error) {
        console.error("Error in create order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body;
        const userId = req.user._id;

        if (paymentFailed) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed", fulfillmentStatus: "Cancelled" },
                { new: true }
            );

            return res.status(400).json({ status: false, message: "Payment failed", order });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(sign.toString()).digest("hex");

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "Paid",
                    fulfillmentStatus: "Processing",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                },
                { new: true }
            );

            await Cart.findOneAndUpdate({ userId }, { $set: { items: [], totalPrice: 0 } });
            return res.json({ success: true, message: "Payment verified successfully", order });
        }

        await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { status: "Failed", fulfillmentStatus: "Cancelled" },
            { new: true }
        );

        return res.status(400).json({ success: false, message: "Invalid signature" });
    } catch (error) {
        console.error("Error in verify payment:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.id;
        const orders = await Order.find({ user: userId })
            .populate("products.productId", "productName productPrice productImg brand category")
            .sort({ createdAt: -1 });

        const formattedOrders = formatOrdersForResponse(orders);
        const summary = {
            totalOrders: formattedOrders.length,
            activeOrders: formattedOrders.filter((order) => order.tracking.isOngoing).length,
            deliveredOrders: formattedOrders.filter((order) => order.tracking.fulfillmentStatus === "Delivered").length,
            cancelledOrders: formattedOrders.filter((order) => order.tracking.fulfillmentStatus === "Cancelled").length,
        };

        res.json({
            success: true,
            orders: formattedOrders,
            summary,
        });
    } catch (error) {
        console.error("Error in get my orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
