import { Response } from "express";

export const setCookie = (res: Response, name: string, value: string ) => {
    res.cookie(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
}