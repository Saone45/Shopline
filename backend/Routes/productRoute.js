import express from "express";
import {
  isAuthenticated,
  authorizedRoles,
} from "../middleware/authMiddleware.js";
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
  deleteProduct,
  fetchSingleProduct,
  postProductReview,
  deleteReview,
 
} from "../controllers/productController.js";

const router = express.Router();

// create product route -->
router.post(
  "/admin/create",
  isAuthenticated,
  authorizedRoles("Admin"),
  createProduct
);

// fetch all product route -->
router.get("/fetchAll", fetchAllProducts);

//update Product route -->
router.put(
  "/admin/update/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  updateProduct
);

//Delete Product route -->
router.delete(
  "/admin/delete/:productId",
  isAuthenticated,
  authorizedRoles("Admin"),
  deleteProduct
);

// Fetch Single Product-->
router.get("/singleProduct/:productId", fetchSingleProduct);

// Post Product Review route -->
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);

// delete review route -->
router.delete("/delete/review/:productId", isAuthenticated, deleteReview);



export default router;
