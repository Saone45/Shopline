import ErrorHandler from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import nodemailer from "nodemailer";
import { generateEmailTemplate } from "../utils/generateForgetPasswordEmailTemplate.js";
import { generateResetPasswordToken } from "../utils/generateResetPasswordToken.js";
import { url } from "inspector";

// Reqister user controller -->
export const register = catchAsyncErrors(async (req, res, next) => {
  // name, email , password from req -->
  const { name, email, password } = req.body;

  // check all field are rmpty or  -->
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all require fields", 400));
  }

  // check passswor length -->
  if (password.length < 5) {
    return next(
      new ErrorHandler("Password must be more than 5 character", 400)
    );
  }

  // check user already exists or not  -->
  const isAlreadyReqister = await User.findOne({ email });

  if (isAlreadyReqister) {
    return next(new ErrorHandler("User already exists with this email.", 400));
  }

  // hash user password -->
  const hashedPassword = await bcrypt.hash(password, 10);

  // create new user -->
  const user = await User.create({ name, email, password: hashedPassword });

  // send token -->
  sendToken(user, 201, "✅User Register Successfully", res);
});

// Login Controller -->
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // validate input fields -->
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }

  // check if User Exists or not -->
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // compare password -->
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // send token -->
  sendToken(user, 200, "User Logged In Successfully", res);
});

// getUser controller -->
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    success: true,
    user,
  });
});

// logout user Controller -->
export const logOut = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "🥲Logged Out sucessfully✅",
    });
});

// forget password controller  -->
export const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const { frontendUrl } = req.query;

  // check for email
  if (!email) {
    return next(new ErrorHandler("Please enter your email", 401));
  }

  // find user -->
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email.", 404));
  }

  // generate reset token -->
  const { hashToken, resetPasswordExpireTime, resetToken } =
    generateResetPasswordToken();

  user.reset_password_token = hashToken;
  user.reset_password_expire = resetPasswordExpireTime;

  await user.save({ validateBeforeSave: false });

  //  Reset Url -->
  const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

  // Email Message -->
  const message = generateEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // rollBack token fields if email fails -->
    user.reset_password_token = undefined;
    user.reset_password_expire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

//Reset Password Controller -->
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  // hash the token to match stored value -->
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // find user with valid token and not expired
  const user = await User.findOne({
    reset_password_token: resetPasswordToken,
    reset_password_expire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or Expired reset token", 400));
  }

  // check password match -->
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  // validate passsword length -->
  if (req.body.password?.length < 5 || req.body.confirmPassword?.length < 5) {
    return next(
      new ErrorHandler("Password must be more than 5 character.", 400)
    );
  }

  // hash new password -->
  user.password = await bcrypt.hash(req.body.password, 10);

  // clear reset token fields -->
  user.reset_password_token = undefined;
  user.reset_password_expire = undefined;

  await user.save();

  // Log user in with new password
  sendToken(user, 200, "Password reset successfully ✅", res);
});

// update Password -->
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // validate required fields
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // find user by id and include password field -->
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found"));
  }

  // compare current Password -->
  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Current password is incorrect.", 401));
  }

  // check new password match -->
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match.", 400)
    );
  }

  // validate password length --->
  if (newPassword.length < 5 || confirmNewPassword.length < 5) {
    return next(
      new ErrorHandler("password must be long than 5 character.", 400)
    );
  }

  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);

  // Save update user -->
  res.status(200).json({
    success: true,
    message: "password updated successfully",
  });
});

// updateProfile Controller -->
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // 1. Initialize avatarData to avoid ReferenceError
  let avatarData = null; 

  if (req.files && req.files.avatar) {
    const avatarFile = req.files.avatar;

    if (req.user?.avatar?.public_id) {
      await cloudinary.uploader.destroy(req.user.avatar.public_id);
    }

    const newProfileImage = await cloudinary.uploader.upload(
      avatarFile.tempFilePath,
      {
        folder: "Ecommerse_Avatar",
        width: 150,
        crop: "scale",
      }
    );

    avatarData = {
      public_id: newProfileImage.public_id,
      url: newProfileImage.secure_url,
    };
  }

  // 2. Prepare update object
  const updateData = { name, email };

  // 3. Only add avatar to updateData if a new one was uploaded
  if (avatarData) {
    updateData.avatar = avatarData;
  }

  // 4. THE FIX: Use findByIdAndUpdate 
  // findOneAndUpdate(req.user._id, ...) fails because it expects { _id: req.user._id }
  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully.",
    user,
  });
});
