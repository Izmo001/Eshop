import { NextFunction, Request, Response } from "express";
import { checkotpRestrictions, sendOtp, trackOtpRequest, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, validationError } from "@packages/error-handler";
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";
//Register a new user
export const userRegistration = async (req: Request, res: Response, next:NextFunction) => {
    try {
        validateRegistrationData(req.body, "user");
        const { name, email } = req.body;

        const existingUser = await prisma.users.findUnique({
            where: {
                email: email ,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        await checkotpRestrictions(email, next);
        await trackOtpRequest(email, next);
        await sendOtp(name, email, "user_activation-mail");

        res.status(200).json({
            message: "Registration successful. Please check your email for the OTP.",
        }); 
    } catch (error) {
        return next(error);
    }
}

//verify user with otp
export const verifyUser = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const { email, otp, password, name } = req.body;
        if (!email || !otp || !password || !name) {
            return next(new validationError( "Missing required fields" ));

        }
        const existingUser = await prisma.users.findUnique({where : {email : email}});
        if (existingUser) {
            return next(new validationError( "User already exists" ));
        }
        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.users.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(200).json({
            success: true,
            message: "User verified successfully",
        });
    } catch (error) {
        return next(error);
    }
}

//Login user
export const LoginUser = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new validationError( "Missing required fields" ));
        }
        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return next(new validationError( "User not found" ));
        }
        //verify password
        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) {
            return next(new AuthError( "Invalid password" ));

        }

        //  generate access and refresh  JWT token
        const accessToken = jwt.sign(
            { id: user.id, role: "user"},
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15min" }
        );
        const refreshToken = jwt.sign(
            { id: user.id, role: "user"},
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );
        //store access and refresh token in httpOmly secure cookie

        setCookie(res, "access_token", accessToken);
        setCookie(res, "refresh_token", refreshToken); 
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { 
                id: user.id,
                name: user.name,
                email: user.email,
            },
            access_token: accessToken,
            refresh_token: refreshToken,
        }); 
    } catch (error) {
        return next(error);
    }
}