import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // foreign key reference to User schema
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
    min: 0, // CHECK (total_price >= 0)
  },
  tax_price: {
    type: Number,
    required: true,
    min: 0, // CHECK (tax_price >= 0)
  },
  shipping_price: {
    type: Number,
    required: true,
    min: 0, // CHECK (shipping_price >= 0)
  },
  order_status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  paid_at: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || value <= new Date(); // equivalent to CHECK (paid_at IS NULL OR paid_at <= CURRENT_TIMESTAMP)
      },
      message: "Paid date cannot be in the future",
    },
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now, // equivalent to CURRENT_TIMESTAMP
  },
});

const Order = mongoose.model('Order',orderSchema);
export default Order;
