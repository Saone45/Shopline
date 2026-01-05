import crypto from "crypto";

export const generateResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");

  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const resetPasswordExpireTime = Date.now() + 15 * 60 * 1000; // 15 minute

  return { resetToken, hashToken, resetPasswordExpireTime };
};
