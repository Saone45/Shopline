import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", // foreign key reference to Order schema
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // foreign key reference to Product schema
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // equivalent to CHECK (quantity > 0)
  },
  price: {
    type: Number,
    required: true,
    min: 0, // equivalent to CHECK (price >= 0)
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, // equivalent to CURRENT_TIMESTAMP
  },
});

const OrderItem = mongoose.model("OrderItem",orderItemSchema);

export default OrderItem;
