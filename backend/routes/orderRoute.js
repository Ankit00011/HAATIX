import express from "express"
import {isAuthenticated} from "../middleware/isAuthenticated.js";
import {createOrder, verifyPayment, getMyOrder} from "../controllers/orderController.js"

const router =  express.Router()

router.post("/create-order", isAuthenticated ,createOrder)
router.post("/verify-payment", isAuthenticated, verifyPayment)
router.get("/my-orders", isAuthenticated, getMyOrder)

export default router