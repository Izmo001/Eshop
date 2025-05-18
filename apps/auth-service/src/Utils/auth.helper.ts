/* eslint-disable @nx/enforce-module-boundaries */
import crypto from 'crypto';
import redis from '../../../../packages/libs/redis/index';
import { ValidationError } from "../../../../packages/middleware/error-handler";
import { sendEmail } from "../Utils/sendMail"; // 🔁 Replace with your actual email sending function
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';



// Email regex validator
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


type RegistrationData = {
  email: string;
  password: string;
  name: string;
  Phone_number: string;
  country: string;
};

// Validate registration fields
export const validateRegistrationData = (data: RegistrationData,) => {
  const { email, password, name, Phone_number, country } = data;

  if (!email || !password || !name || !Phone_number || !country) {
    throw new ValidationError("All fields are required");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
  }
};

// OTP Rate Limit Check
export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
    if ( await redis.get(`otp_lock:${email}`)){
      return next (
        new ValidationError("ACcount is locked for 30 minutes due to too many failed OTP requests attempts")
    );
  }
  if ( await redis.get (`otp_spam_lock:${email}`)){
    return next (
      new ValidationError("You have reached the maximum number of OTP requests. Please try again after 1hour.")
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next (
      new ValidationError("Please wait before requesting another OTP")
    );
  } 
}
  
// Track OTP requests
export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpRequests = parseInt(await redis.get(otpRequestKey) || "0");

  if (otpRequests > 2) {
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 60 * 60); // 1 hour lock
    return next(
      new ValidationError(
        "You have reached the maximum number of OTP requests. Please try again after 1 hour."
      )
    );
  }
  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 60 * 60); // 1 hour expiration
}
// Send OTP via email
export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Send OTP via email
  await sendEmail(email, "Verify your email", template, { name, otp });

  // Store OTP and cooldown in Redis
  await redis.set(`otp:${email}`, JSON.stringify({ otp, expirationTime }), 'EX', 5 * 60);
  await redis.set(`otp_cooldown:${email}`, '1', 'EX', 60); // 1-minute cooldown
};
// Verify OTP
export const verifyOtp = async (
  email: string,
  otp: string
): Promise<{ success: boolean; message: string } | { success: false; message: string }> => {
  try {
    // Retrieve OTP data from Redis
    const otpData = await redis.get(`otp:${email}`);

    if (!otpData) {
      return { success: false, message: "OTP expired or not found" };
    }
    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt(await redis.get(failedAttemptsKey) || "0");

    // Check if OTP is incorrect
    if (otpData !== otp) {
      const remainingAttempts = 2 - failedAttempts;

      if (failedAttempts >= 2) {
        await redis.set(`otp_lock:${email}`, "locked", "EX", 30 * 60); // 30 mins
        await redis.del(failedAttemptsKey);
        await redis.del(`otp:${email}`);
        return {
          success: false,
          message: "Account is locked for 30 minutes due to too many failed OTP attempts"
        };
      }

      await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 5 * 60); // 5 mins
      return {
        success: false,
        message: `Incorrect OTP. You have ${remainingAttempts} attempt(s) left.`
      };
    }

    // ✅ OTP is valid
    await redis.del(`otp:${email}`);
    await redis.del(failedAttemptsKey);

    // You may also update DB or user state here

    return {
      success: true,
      message: "OTP verified successfully",
    };
  } catch {
    return {
      success: false,
      message: "OTP verification failed"
    };
  }
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,  
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try{
    const { email } = req.body;
    if (!email) {
      return next(new ValidationError("Email is required"));
    }
    //find user/seller in db
    const user = userType == "user" &&await PrismaClient.users.findUnique({
      where: { email },
    });
    if (!user) 
      throw new ValidationError(`${userType } not found!`);

      //check otp restrictions
      await checkOtpRestrictions(email, next);
      //track otp requests
      await trackOtpRequests(email, next);

      //generate otp and send email
      await sendOtp(user.name, email,  "forgot-password_mail");
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully, please verify your email",
      });
  }catch {
    next(new ValidationError("An error occurred while processing your request."));
  }
};

export const verifyPasswordOtp = async (req: Request , res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new ValidationError("Email and OTP are required"));
    }
    // Verify OTP
    const result = await verifyOtp(email, otp);
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      return next(new ValidationError(result.message));
    }
  } catch {
    next(new ValidationError("An error occurred while processing your request."));
  }
};