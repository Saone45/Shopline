import ErrorHandler from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import Payment from "../models/paymentSchema.js";
import ShippingInfo from "../models/shippingInfoSchems.js";
import { generatePaymentIntent } from "../utils/generatePaymentIntent.js";
import OrderItem from "../models/orderItemSchema.js";


// Place New Order controller -->
export const placeNewOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    full_name,
    state,
    city,
    country,
    address,
    pincode,
    phone,
    orderedItems,
  } = req.body;

  //  Validation
  if (
    !full_name ||
    !state ||
    !city ||
    !country ||
    !address ||
    !pincode ||
    !phone
  ) {
    return next(
      new ErrorHandler("Please Provide Complete Shipping Details", 400)
    );
  }

  const items = Array.isArray(orderedItems)
    ? orderedItems
    : JSON.parse(orderedItems);

  if (!items || items.length === 0) {
    return next(new ErrorHandler("No items in cart", 400));
  }

  //  Fetch Products and Calculate Totals -->
  let total_price = 0;
  const processedOrderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product.id);

    if (!product) {
      return next(
        new ErrorHandler(`Product not found for ID: ${item.product.id}`, 404)
      );
    }

    if (item.quantity > product.stock) {
      return next(
        new ErrorHandler(
          `Only ${product.stock} units available for ${product.name}`,
          400
        )
      );
    }

    const itemTotal = product.price * item.quantity;
    total_price += itemTotal;

    // Build the order item object
    processedOrderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      image: item.product.images[0]?.url || "",
    });
  }

  //  Financial Calculations
  const tax_price = 0.18; // 18%
  const shipping_price = total_price >= 50 ? 0 : 2;
  const final_total = Math.round(
    total_price + total_price * tax_price + shipping_price
  );

  //  Create Order Document
  // In MongoDB, we usually nest shippingInfo and orderItems inside the Order document
  const order = await Order.create({
    buyer_id: req.user._id,
    total_price: final_total,
    tax_price: tax_price,
    shipping_price: shipping_price,
    order_status: "Processing",
  });

  // Save Shipping info -->
  await ShippingInfo.create({
    order_id: order._id,
    full_name,
    state,
    city,
    country,
    address,
    pincode,
    phone,
  });

  // save orderItems -->
  const itemsWithOrderId = processedOrderItems.map(item => ({
    order_id: order.id,
    product_id : item.product,
    quantity: item.quantity,
    price:item.price,
    image: item.image,
    title: item.name
  }));

  await OrderItem.insertMany(itemsWithOrderId);

  //  Generate Payment Intent
  const paymentResponse = await generatePaymentIntent(order._id, final_total);

  if (!paymentResponse.success) {
    // Optional: Delete the order if payment intent fails
    // await Order.findByIdAndDelete(order._id);
    return next(new ErrorHandler("Payment Failed. Try again.", 500));
  }

  res.status(200).json({
    success: true,
    message: "Order Placed Successfully. Please proceed to payment.",
    paymentIntent: paymentResponse.clientSecret,
    orderId: order._id,
    total_price: final_total,
  });
});

// fetch Single order -->
export const fetchSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(new ErrorHandler("Invalid Order Id formate", 400));
  }

  const result = await Order.aggregate([
    {
      // Equivalent to WHERE o.id = $1
      $match: { _id: new mongoose.Types.ObjectId(orderId) },
    },
    {
      // Join with order_items table -->
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "order_id",
        as: "order_items",
      },
    },
    {
      // Join with shipping_info table
      $lookup: {
        from: "shippinginfos",
        localField: "_id",
        foreignField: "order_id",
        as: "shipping_info",
      },
    },
    {
      // Flatten shipping_info array (since it's a 1-to-1 relationship)
      $unwind: {
        path: "$shipping_info",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  if (!result || result.length === 0) {
    return next(new ErrorHandler("Order not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "order fetched",
    order: result[0],
  });
});

//// Fetech My Orders -->
export const fetchMyOrders = catchAsyncErrors(async (req, res, next) => {
  // Ensure user ID is treated as a mongoDb ObjectId
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const myOrder = await Order.aggregate([
    {
      //  Eqivalent to: Where o. buyerid = $1
      $match: { buyer_id: userId },
    },
    {
      // Equivalent to: LEFT JOIN order_items
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "order_id",
        as: "order_items",
      },
    },
    {
      // Equivalent to: LEFT JOIN shipping_info
      $lookup: {
        from: "shippinginfos",
        localField: "_id",
        foreignField: "order_id",
        as: "shipping_info",
      },
    },
    {
      // Equivalent to: json_build_object for shipping_info
      // Since shipping_info is 1-to-1, we turn the array into a single object
      $unwind: {
        path: "$shipping_info",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { created_at: -1 },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "All Yours Orders Fetched",
    myOrder,
  });
});

// Fetch All orders for Admin -->
export const fetchAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.aggregate([
    {
      //  JOIN with orderitems collection
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "order_id",
        as: "order_items",
      },
    },
    {
      // 2. JOIN with shippinginfos collection
      $lookup: {
        from: "shippinginfos",
        localField: "_id",
        foreignField: "order_id",
        as: "shipping_info",
      },
    },
    {
      // 3. Convert shipping_info from an array to an object
      // SQL equivalent: json_build_object
      $unwind: {
        path: "$shipping_info",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { created_at: -1 },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "All orders Fetched",
    orders: orders,
  });
});

//Update Order Status -->
export const updateAllOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const { orderId } = req.params;

  // validate -->
  if (!status) {
    return next(new ErrorHandler("Provide a valid status for order.", 400));
  }

  // find and Update  -->
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { order_status: status },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  // check if order Exists -->
  if (!updatedOrder) {
    return next(new ErrorHandler("Invalid order ID.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order status Updated",
    updatedOrder: updatedOrder,
  });
});

// Delete Order -->
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;

  // findByIdAndDelete returns the document that wa deleted -->
  const order = await Order.findById(orderId);

  if(!order) {
        return next(new ErrorHandler("Invalid order ID.", 404));
  }
 

  // Delete related data from all collections -->
   const deleteOrder =   await Promise.all([
    OrderItem.deleteMany({order_id: orderId}),
    ShippingInfo.deleteOne({order_id: orderId}),
    Payment.deleteOne({ order_id: orderId}),
    Order.findByIdAndDelete(orderId) // delete the main order -->
  ])
   

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
    order : deleteOrder,
  });
});
