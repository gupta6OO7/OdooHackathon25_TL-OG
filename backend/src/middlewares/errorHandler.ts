import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);

  // Default error status and message
  let statusCode = 500;
  let message = "Internal Server Error";

  // Handle specific error types
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = error.message;
  } else if (error.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  } else if (error.name === "NotFoundError") {
    statusCode = 404;
    message = "Resource not found";
  } else if (error.message) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
};
