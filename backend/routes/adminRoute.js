import express from "express";
import { getAdminOverview, getAdminUserOrders, getAllAdminOrders } from "../controllers/adminController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/overview", isAuthenticated, isAdmin, getAdminOverview);
router.get("/orders", isAuthenticated, isAdmin, getAllAdminOrders);
router.get("/users/:userId/orders", isAuthenticated, isAdmin, getAdminUserOrders);

export default router;
