import { AppError } from "./index";
import { Request, Response, } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
) => {
  if (err instanceof AppError) {
    console.error(`Error: ${req.method} ${req.url} - ${err.message}`);

    const errorResponse= {
      status: "error",
      message: err.message,
      details: err.details || null,
    };

    if (err.details) {
      errorResponse.details = err.details;
    }

    return res.status(err.statusCode).json(errorResponse);
  }

  console.error("Unhandled Error: ", err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
