import ErrorHandler from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import User from "../models/userSchema.js";
import  Order from "../models/orderSchema.js";
import Product from "../models/productSchema.js";
import { v2 as cloudinary } from "cloudinary";

// getAll Users -->
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  // pagination -->
  const page = parseInt(req.query.page) || 1;
  const resPerPage = 10;
  const skip = (page - 1) * resPerPage;

  // count total users with the role user;
  const totalUsers = await User.countDocuments({ role: "User" });

  // Fetch users with Filter, Sort, Skip, and Limit
  const users = await User.find({ role: "User" })
    .sort({ created_at: -1 }) // Sort by newest first
    .skip(skip)
    .limit(resPerPage);

  // Send Response -->
  res.status(200).json({
    success: true,
    totalUsers,
    resPerPage,
    currentPage: page,
    users,
  });
});

// delete user -->
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // find and delete user in ine step -->
     const user = await User.findByIdAndDelete(id);

     if(!user) {
        return next(new ErrorHandler("User not Found", 404));
     }

     // Delete Avatar from cloudinary if it exists -->
     if(user.avatar && user.avatar.public_id){
        await cloudinary.uploader.destroy(user.avatar.public_id);
     }

     // send Response -->
     res.status(200).json({
        success: true,
        message: "User deleted Successfully"
     });
});

// Dsahboard Stats -->
export const dashboardStats = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  // 1. Total Revenue All Time & Order Status Counts
  const orderStats = await Order.aggregate([
    {
      $facet: {
        totalRevenue: [{ $group: { _id: null, sum: { $sum: "$totalPrice" } } }],
        statusCounts: [{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }],
        todayRev: [
          { $match: { createdAt: { $gte: today } } },
          { $group: { _id: null, sum: { $sum: "$totalPrice" } } }
        ],
        yesterdayRev: [
          { $match: { createdAt: { $gte: yesterday, $lt: today } } },
          { $group: { _id: null, sum: { $sum: "$totalPrice" } } }
        ],
        currentMonthRev: [
          { $match: { createdAt: { $gte: currentMonthStart } } },
          { $group: { _id: null, sum: { $sum: "$totalPrice" } } }
        ],
        previousMonthRev: [
          { $match: { createdAt: { $gte: previousMonthStart, $lte: previousMonthEnd } } },
          { $group: { _id: null, sum: { $sum: "$totalPrice" } } }
        ]
      }
    }
  ]);

  // 2. Monthly Sales for Line Chart
  const monthlySales = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%b %Y", date: "$createdAt" } },
        date: { $min: "$createdAt" },
        totalSales: { $sum: "$totalPrice" }
      }
    },
    { $sort: { date: 1 } },
    { $project: { _id: 0, month: "$_id", totalSales: 1 } }
  ]);

  // 3. Top 5 Selling Products (Assumes orderItems are embedded in Order)
  const topSellingProduct = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        total_sold: { $sum: "$orderItems.quantity" }
      }
    },
    { $sort: { total_sold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        name: "$productDetails.name",
        image: { $arrayElemAt: ["$productDetails.images.url", 0] },
        category: "$productDetails.category",
        ratings: "$productDetails.ratings",
        total_sold: 1
      }
    }
  ]);

  // 4. User Stats & Low Stock
  const totalUserCount = await User.countDocuments({ role: "User" });
  const newUserThisMonth = await User.countDocuments({
    role: "User",
    createdAt: { $gte: currentMonthStart }
  });
  const lowStockProduct = await Product.find({ stock: { $lte: 5 } }).select("name stock");

  // Format Aggregation Data
  const totalRevenueAllTime = orderStats[0].totalRevenue[0]?.sum || 0;
  const todayRevenue = orderStats[0].todayRev[0]?.sum || 0;
  const yesterdayRevenue = orderStats[0].yesterdayRev[0]?.sum || 0;
  const currentMonthSales = orderStats[0].currentMonthRev[0]?.sum || 0;
  const lastMonthRevenue = orderStats[0].previousMonthRev[0]?.sum || 0;

  const orderStatusCounts = { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
  orderStats[0].statusCounts.forEach(item => {
    if (orderStatusCounts.hasOwnProperty(item._id)) orderStatusCounts[item._id] = item.count;
  });

  // Calculate Growth
  let revenueGrowth = "0%";
  if (lastMonthRevenue > 0) {
    const growthRate = ((currentMonthSales - lastMonthRevenue) / lastMonthRevenue) * 100;
    revenueGrowth = `${growthRate >= 0 ? "+" : ""} ${growthRate.toFixed(2)}%`;
  }

  res.status(200).json({
    success: true,
    totalRevenueAllTime,
    todayRevenue,
    yesterdayRevenue,
    totalUserCount,
    orderStatusCounts,
    monthlySales,
    currentMonthSales,
    topSellingProduct,
    lowStockProduct,
    revenueGrowth,
    newUserThisMonth,
  });
});
