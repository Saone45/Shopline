import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/productSchema.js";
import ProductReview from '../models/productReviewSchema.js';
import Order from '../models/orderSchema.js';

// create Product Controller -->
export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  // validation -->
  if (!name || !description || !price || !category || !stock) {
    return next(
      new ErrorHandler("Please Provide Complete Product details.", 400)
    );
  }

  // handle Image uploads -->
  let uploadImages = [];

  if (req.files && req.files.images) {
    // Ensure image is alwezz an array (handle single or multiple uploads)
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Ai_Ecommerse_Product_Image",
        width: 1000,
        crop: "scale",
      });

      uploadImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  // save product in mongoDb -->
  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images: uploadImages,
    created_by: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created Successsfully",
    product,
  });
});

// FetchAllProducts -->
export const fetchAllProducts = catchAsyncErrors(async (req, res, next) => {
  const { availability, price, category, ratings, search } = req.query;

  // pagination setup -->
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Build Query object -->
  let query = {};

  // search logic (Regex is eqivalent to ILIKE)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Category Filter -->
  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  // Availability Filter -->
  if (availability === "in-stock") {
    query.stock = { $gt: 5 };
  } else if (availability === "limited") {
    query.stock = { $gt: 0, $lte: 5 };
  } else if (availability === "out-of-stock") {
    query.stock = 0;
  }

  // Price Range Filter -->
  if (price) {
    const [minPrice, maxPrice] = price.split("-");
    if (minPrice && maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }
  }

  // Rating Filter -->
  if (ratings) {
    query.ratings = { $gte: Number(ratings) };
  }

  // Execute Main Query with pagination -->
  const totalProducts = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort({ created_at: -1 }) // DESC order
    .limit(limit)
    .skip(skip);

  // Fetch New Product (created in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newProducts = await Product.find({
    created_at: { $gte: thirtyDaysAgo },
  })
    .sort({ created_at: -1 })
    .limit(8);

  // Fetch Top Rated Products (Rating >=4.5)
  const topRatedProducts = await Product.find({
    ratings: { $gte: 4.5 },
  })
    .sort({ ratings: -1, created_at: -1 })
    .limit(8);

  // send response -->
  res.status(200).json({
    success: true,
    totalProducts,
    resPerPage: limit,
    products,
    newProducts,
    topRatedProducts,
  });
});

//updateProduct controller -->
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, category, stock } = req.body;

  // validation for required fields -->
  if (!name || !category || !description || !price || !stock) {
    return next(
      new ErrorHandler(`Please Provide Complete product details.`, 400)
    );
  }

  // find and update product -->

  // findBYIdAndUpdate -->
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      description,
      price,
      category,
      stock,
    },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  // send Responce -->
  res.status(200).json({
    success: true,
    message: "Product Updated Sucessfully",
    updatedProduct,
  });
});

//Delete Product -->
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const {productId} = req.params;

    // find the product first to get the image public_ids -->
    const product = await Product.findById(productId);

    if(!product){
        return next(new ErrorHandler('Product not Found',404));
    }

    // delete image from cloudinary
    // mongoDb stores the array directly, so we can access product.image
    if(product.images && product.images.length > 0) {
        for (const image of product.images){
            await cloudinary.uploader.destroy(image.public_id);
        }
    };

    // delete the product from mongodb -->
    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully",
        deletedProduct:product,
    })
});

// Fetch single Product -->
export const fetchSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const {productId} = req.params;

    // find product by id -->
    // we use .populate to get review details and the user details inside those reviews -->
    const product = await Product.findById(productId);

    if(!product){
        return next(new ErrorHandler('product not Found',404));
    }

    // fetch Revies for this product 
    // We populate the 'user' field inside the Review to get name and avatar
    const reviews = await ProductReview.find({product_id:productId}).populate({
      path:"user_id",
      select:"name avatar",
    }).sort({created_at:-1});

    // send Response -->
    res.status(200).json({
      success:true,
      message:"Product Fetched Successfully",
      product:{
        ...product._doc, //Spread the product data
        reviews, //Attach the populated reviews array
      }
    });
});

// post Product Reviews -->
export const postProductReview = catchAsyncErrors(async (req, res, next) => {
  const {productId} = req.params;
  const {rating, comment} = req.body;

  if(!rating || !comment){
    return next(new ErrorHandler("Please Provide rating and comment.",400));
  }

  // check if user purchased the product 
  // match sql join order -> order_items -> payments 

  const hasPurchased = await Order.findOne({
    user: req.user._id,
    "orderItems.product" : productId,
    payment_status:"paid",
  });

  if(!hasPurchased) {
    return next(new ErrorHandler('You can only review products you have purchased ',403));
  }

  // 2. Check if Product exists
  const product = await Product.findById(productId);
  if(!product){
    return next(new ErrorHandler('Product not found',404));
  }

  //3. check if user alredy revewed or create one
  // mongoDb find and update with upsert can handle both logic -->
  const review = await ProductReview.findOneAndUpdate(
    {product_id: productId, user_id: req.user._id},
    {rating: Number(rating), comment},
    {new:true, upsert: true, runValidators: true}
  );

  // Recalculate Average Rating for the product -->
  const reviews = await ProductReview.find({product_id: productId});

  const avgRating = reviews.reduce((acc,item)=> item.rating + acc, 0) / reviews.length;

  // Update the Product with the new avg rating
  product.ratings = avgRating.toFixed(1); // rounding to 1 decimal place

  await product.save();

  res.status(200).json({
    success:true,
    message:"Review Posted Successfully",
    review,
    product,
  });

});

// Delete Review -->
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const {productId} = req.params;

  // find and delete the review belonging to this user and product
  const review = await ProductReview.findOneAndDelete({
    product_id:productId,
    user_id:req.user._id,
  });

  if(!review){
    return next(new ErrorHandler('Review not found',404));
  }

  //Recalculate the Average Rating
  const remainingReviews = await ProductReview.find({product_id:productId});

  let newAvgRating = 0;

  if(remainingReviews.length > 0) {
    const totalRating = remainingReviews.reduce((acc, item) => item.rating + acc, 0);
    newAvgRating = totalRating / remainingReviews.length;
  }

  // Update the produt -->
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {ratings: newAvgRating.toFixed(1)},
    {new:true, runValidators:true}
  );

  res.status(200).json({
    success:true,
    message:"Your Review has been deleted",
    review,
    product : updatedProduct,
  });
});


