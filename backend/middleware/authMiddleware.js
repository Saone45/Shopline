import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import User from "../models/userSchema.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // aquire toke from cookies -->
  const { token } = req.cookies;

  // checking token -->
  if (!token) {
    return next(new ErrorHandler("Please Login to Access this Resource", 401));
  }

  // decode Token -->
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // find user -->
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }

  req.user = user; // attach user to request -->
  next();
});

// Middleware to restrict access Based on roles -->
export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource.`,
          402
        )
      );
    }
    next();
  };
};
