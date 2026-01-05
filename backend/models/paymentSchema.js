import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", // foreign key reference to Order schema
    required: true,
    unique: true, // one payment per order
  },
  payment_type: {
    type: String,
    enum: ["Online"], // CHECK (payment_type IN ('Online'))
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["Paid", "Pending", "Failed"], // CHECK (payment_status IN ('Paid','Pending','Failed'))
    required: true,
  },
  payment_intent_id: {
    type: String,
    unique: true, // unique identifier from payment gateway (e.g., Stripe intent ID)
    sparse: true, // allows multiple nulls
  },
  client_secret: { 
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, // equivalent to CURRENT_TIMESTAMP
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
