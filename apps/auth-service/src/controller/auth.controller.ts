import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
// eslint-disable-next-line
import { ValidationError } from "../../../../packages/middleware/error-handler/index";
import {
  validateRegistrationData,
  checkOtpRestrictions,
  trackOtpRequests,
  sendOtp,
  verifyOtp,
  handleForgotPassword,
  verifyPasswordOtp,
} from "../Utils/auth.helper";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../Utils/cookies/setCookie";

const prisma = new PrismaClient();

export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    validateRegistrationData(req.body);

    const { name, email } = req.body;

    // ✅ Corrected: `where` expects a flat object
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email"));
    }

    // Perform OTP-related checks and tracking
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, "user-activation_mail");

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully, please verify your email",
    });
  } catch (error) {
    next(error);
  }
};

//veruify user with OTP

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const { email, otp , password, name} = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All fields are required"));
    }

    const existingUser = await prisma.users.findUnique({where : { email }});
    if (existingUser) {
        return next(new ValidationError("User already exists with this email"));
    }
    await verifyOtp(email, otp);
    const hashedPassword = bcrypt.hashSync(password, 10);
 
    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });
    if (!user) {
      return next(new ValidationError("User registration failed"));
     } 

  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error) {
      return next(new ValidationError("Invalid OTP"));    
    
  }
  return res.status(200).json({
    success: true,
    message: "User registered successfully",
  });
}


//user login
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Email and password are required"));
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new ValidationError("Invalid email or password"));
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return next(new ValidationError("Invalid email or password"));
    }

    // Generate access and refresh JWT token here (if applicable)
     const accessToken = jwt.sign({id: user.id, role:"user"},
      process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: "15m",
    });
    // const token = generateToken(user.id);
    const refreshToken = jwt.sign({id: user.id, role:"user"},
      process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: "7d",
    });
    // Store refresh token in the database or Redis in an httponly secure  cookie(if applicable)
    setCookie(res, "refreshToken", refreshToken)
    setCookie(res, "accessToken", accessToken)

    return res.status(200).json({
      success: true, 
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      // token,
    });
  } catch (error) {
    next(error);
  }
};


//user forgot password
export const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  await handleForgotPassword(req, res, next, "user");
}


//verify user forgot password OTP
export const verifyUserForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await verifyPasswordOtp(req, res, next);
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new ValidationError("Email and OTP are required"));
    }

    await verifyOtp(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};


//user reset password
export const userResetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new ValidationError("All fields are required"));
    }

    const user = await PrismaClient.users.findUnique({where: { email }});
    if (!user){
      return next(new ValidationError("User not found"));
    }

    //compare new password with old password
    const isSamePassword = bcrypt.compareSync(newPassword, user.password);
    if (isSamePassword) {
      return next(new ValidationError("New password cannot be the same as the old password"));
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await PrismaClient.users.update({
      where: { email },
      data: { password: hashedPassword },
    });
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};  