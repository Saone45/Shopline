import mongoose from "mongoose";

const shippingInfoSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", // foreign key reference to Order schema
    required: true,
    unique: true, // one shipping info per order
  },
  full_name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  state: {
    type: String,
    required: true,
    maxlength: 100,
  },
  city: {
    type: String,
    required: true,
    maxlength: 100,
  },
  country: {
    type: String,
    required: true,
    maxlength: 100,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
    maxlength: 10,
  },
  phone: {
    type: String,
    required: true,
    maxlength: 20,
  },
});

const ShippingInfo = mongoose.model("ShippingInfo", shippingInfoSchema);

export default ShippingInfo;
