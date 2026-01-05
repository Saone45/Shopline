import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // foreign key reference to Product schema
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // foreign key reference to User schema
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5, // equivalent to CHECK (rating BETWEEN 0 AND 5)
  },
  comment: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, // equivalent to CURRENT_TIMESTAMP
  },
});

const ProductReview = mongoose.model("ProductReview", productReviewSchema);
export default ProductReview;
