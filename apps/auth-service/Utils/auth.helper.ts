/* eslint-disable @nx/enforce-module-boundaries */
import crypto from 'crypto';
import Redis from 'ioredis';
import { ValidationError } from "../../../packages/middleware/error-handler/index";
import { sendEmail } from "../Utils/sendMail/index"; // 🔁 Replace with your actual email sending function
import { NextFunction } from "express";

// Setup Redis client
const redis = new Redis();

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
