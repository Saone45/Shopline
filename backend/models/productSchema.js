import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // equivalent to CHECK (price >= 0)
  },
  category: {
    type: String,
    required: true,
    maxlength: 100,
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5, // equivalent to CHECK (ratings BETWEEN 0 AND 5)
  },
  images: {
    type: [Object], // JSONB → array of objects
    default: [],
  },
  stock: {
    type: Number,
    required: true,
    min: 0, // equivalent to CHECK (stock >= 0)
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // foreign key reference to User schema
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product',productSchema);

export default Product;
