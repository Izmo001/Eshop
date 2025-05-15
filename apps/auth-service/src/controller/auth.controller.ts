/* eslint-disable @nx/enforce-module-boundaries */
import { Request, Response, NextFunction,} from "express";
import { PrismaClient } from "@prisma/client";

import { ValidationError } from "../../../../packages/middleware/error-handler/index";
import { validateRegistrationData, checkOtpRestrictions, trackOtpRequests, sendOtp } from "../utils/auth.helper"; // 🔁 Replace with your actual email sending function

const Prisma = new PrismaClient();

export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRegistrationData(req.body,);

    const { email } = req.body;

    // Corrected findUnique
    const existingUser = await Prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email"));
    }

    // Pass next if checkOtpRestrictions requires it
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next); 
    await sendOtp (email, "user-activation-mail");


    return res.status(200).json({
      success: true,
      message: "OTP sent successfully, please verify your email",
    });
  } catch (error) {
    next(error);
  }
};
