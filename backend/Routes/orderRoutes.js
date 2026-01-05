import express from "express";
import {
  placeNewOrder,
  fetchSingleOrder,
  fetchMyOrders,
  fetchAllOrders,
  updateAllOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import {
  isAuthenticated,
  authorizedRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// place new Order route -->
router.post("/new", isAuthenticated, placeNewOrder);

// fetch Single order route -->
router.get("/:orderId", isAuthenticated, fetchSingleOrder);

// fetch My Orders Routes -->
router.get("/orders/me", isAuthenticated, fetchMyOrders);

// fetch All Orders for admin -->
router.get(
  "/admin/getall",
  isAuthenticated,
  authorizedRoles("Admin"),
  fetchAllOrders
);

// Update Order Status route -->
router.put(
  "/admin/update/:orderId",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateAllOrderStatus
);

//Delete Order -->
router.delete(
  "/admin/delete/:orderId",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteOrder
);

export default router;
