import mongoose from "mongoose";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

const buildOrderQuery = async (match = {}) => {
    const orders = await Order.find(match)
        .populate("user", "firstName lastName email profilePic role city createdAt")
        .populate("products.productId", "productName productPrice productImg brand category")
        .sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const paidOrders = orders.filter((order) => order.status === "Paid");
    const failedOrders = orders.filter((order) => order.status === "Failed");
    const pendingOrders = orders.filter((order) => order.status === "Pending");
    const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

    return {
        orders,
        summary: {
            totalOrders,
            paidOrders: paidOrders.length,
            pendingOrders: pendingOrders.length,
            failedOrders: failedOrders.length,
            totalRevenue,
        },
    };
};

export const getAdminOverview = async (_, res) => {
    try {
        const [userCount, productCount, orderCount, paidOrders, recentOrders, monthlyRevenueRaw, topSellingRaw] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.find({ status: "Paid" }).select("amount"),
            Order.find()
                .populate("user", "firstName lastName email")
                .sort({ createdAt: -1 })
                .limit(6),
            Order.aggregate([
                {
                    $match: {
                        status: "Paid",
                        createdAt: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        revenue: { $sum: "$amount" },
                        orders: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            Order.aggregate([
                { $match: { status: "Paid" } },
                { $unwind: "$products" },
                {
                    $lookup: {
                        from: "products",
                        localField: "products.productId",
                        foreignField: "_id",
                        as: "productDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$productDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: "$products.productId",
                        unitsSold: { $sum: "$products.quantity" },
                        revenue: {
                            $sum: {
                                $multiply: [
                                    "$products.quantity",
                                    { $ifNull: ["$productDetails.productPrice", 0] },
                                ],
                            },
                        },
                    },
                },
                { $sort: { unitsSold: -1 } },
                { $limit: 5 },
            ]),
        ]);

        const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
        const paidOrdersCount = paidOrders.length;
        const conversionRate = orderCount ? Number(((paidOrdersCount / orderCount) * 100).toFixed(1)) : 0;

        const topProductIds = topSellingRaw.map((item) => item._id).filter(Boolean);
        const topProducts = await Product.find({ _id: { $in: topProductIds } }).select("productName productImg category brand productPrice");
        const topProductMap = new Map(topProducts.map((product) => [product._id.toString(), product]));

        const monthlySales = monthlyRevenueRaw.map((item) => ({
            label: `${String(item._id.month).padStart(2, "0")}/${item._id.year}`,
            revenue: item.revenue,
            orders: item.orders,
        }));

        const bestSellingProducts = topSellingRaw.map((item) => {
            const product = topProductMap.get(item._id?.toString());
            return {
                _id: item._id,
                productName: product?.productName || "Removed product",
                category: product?.category || "Unknown",
                brand: product?.brand || "Unknown",
                productPrice: product?.productPrice || 0,
                productImg: product?.productImg || [],
                unitsSold: item.unitsSold,
                revenue: Math.round(item.revenue || 0),
            };
        });

        return res.status(200).json({
            success: true,
            overview: {
                stats: {
                    totalUsers: userCount,
                    totalProducts: productCount,
                    totalOrders: orderCount,
                    paidOrders: paidOrdersCount,
                    totalRevenue,
                    conversionRate,
                },
                recentOrders,
                monthlySales,
                bestSellingProducts,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAllAdminOrders = async (_, res) => {
    try {
        const data = await buildOrderQuery();

        return res.status(200).json({
            success: true,
            ...data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getAdminUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }

        const user = await User.findById(userId).select("-password -otp -otpExpiry -token");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const data = await buildOrderQuery({ user: userId });

        return res.status(200).json({
            success: true,
            user,
            ...data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
