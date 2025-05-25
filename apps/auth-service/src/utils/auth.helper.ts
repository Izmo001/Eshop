import crypto from 'crypto';
import { validationError } from '@packages/error-handler';
import redis from '@packages/libs/redis';
import { sendEmail } from './sendMail';
import { NextFunction, Request, Response } from 'express';
import prisma from '@packages/libs/prisma';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validateRegistrationData = (
    data: any, 
    userType : "user"| "seller") =>{
    const { name,email, password, phone , country } = data;

    if (!name || !email || !password || (userType === "seller" && (!phone || !country))) {
        throw new validationError(`missing required fields`, 400);
    }
    if (!emailRegex.test(email)) {
        throw new validationError(`invalid email format`, 400);
    }
} 
export const checkotpRestrictions = async (email:string, next: NextFunction) => {
    if (await redis.get(`otp-lock:${email}`)) {
        return next(new validationError("You have reached the maximum try again after 30 minutes"));
    }
    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(new validationError("You have reached the maximum try again after 1 hour"));
    }
    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new validationError("You have reached the maximum try again after 1 minute"));
    }
}
export const trackOtpRequest = async (email:string, next: NextFunction) => {
    const OtpRequestKey = ` otp_request_count:${email}`;
    let otpRequest = parseInt((await redis.get(OtpRequestKey)) || "0");
    if (otpRequest >= 2) {
        await redis.set(`otp_spam_lock:${email}`, 1, "EX", 3600);// 1 hour

        return next(new validationError("You have reached the maximum try again after 1 hour"));
    }
    await redis.set(OtpRequestKey, otpRequest + 1, "EX", 60);
}

export const sendOtp = async (name: string, email:string, tempalate:string )=> {
    const otp = crypto.randomInt(1000, 9999);
    await sendEmail( email, "verify your email", tempalate, {name,otp});
    await redis.set(`otp:${email}`, otp, "EX", 300);
    await redis.set(`otp_cooldown:${email}`, 1, "EX", 60);
    await redis.set(`otp:${email}:attempts`, 0, "EX", 300);
}

export const verifyOtp = async (email:string, otp:string, next: NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
        throw new validationError("OTP expired", 400);
    }
    const FailedAttemptsKey = `otp:${email}:attempts`;
    const failedAttempts = parseInt((await redis.get(FailedAttemptsKey)) || "0");

    if ( storedOtp !== otp) {
        if (failedAttempts >= 2) {
            await redis.set(`otp-lock:${email}`, 1, "EX", 1800); // 30 minutes
            await redis.del(`otp:${email}`, FailedAttemptsKey);
            throw new validationError("to many attempts ,You have reached the maximum try again after 30 minutes");
        }
        await redis.set(FailedAttemptsKey, failedAttempts + 1, "EX", 300);   
        throw new validationError(`Invalid OTP, ${2 - failedAttempts} attempts left`, 400);
        }
    // Delete OTP and failed attempts after successful verification
    await redis.del(`otp:${email}`, FailedAttemptsKey);
};


export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new validationError("Missing required field: email"));
    }

    // Lookup based on userType
    let user: any = null;

    if (userType === "user") {
      user = await prisma.users.findUnique({ where: { email } });
    } else if (userType === "seller") {
      user = await prisma.users.findUnique({ where: { email } });
    }

    if (!user) {
      return next(new validationError(`${userType} not found with this email`));
    }

    // OTP logic
    await checkotpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(user.name, email, "forgot_password");

    return res.status(200).json({
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyForgotPasswordotp = async ( 
    req: Request, 
    res: Response,
    next: NextFunction,
   // userType: "user" | "seller"
    ) => {
    try{
        const { email, otp } = req.body;
        if (!email || !otp) {
            return next(new validationError("Missing required fields"));
        }
        await verifyOtp(email, otp, next);
        res.status(200).json({
            message: "OTP verified successfully",
        });
    }catch (error) {
        return next(error);
    }
}