import express from "express";
import {
  getAllUsers,
  deleteUser,
  dashboardStats,
} from "../controllers/adminController.js";
import {
  isAuthenticated, authorizedRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

// getAll user Route -->
router.get(
  "/getallusers",
  isAuthenticated,
  authorizedRoles("Admin"),
  getAllUsers
); // Dashboard -->

// delete User -->
router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteUser
);

// Dashboard stats -->
router.get(
  "/fetch/dashboard-stats",
  isAuthenticated,
  authorizedRoles("Admin"),
  dashboardStats
);

export default router;
