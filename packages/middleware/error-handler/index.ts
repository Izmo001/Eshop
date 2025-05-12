export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string, statusCode: number, isOperational = true, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor)
    }
}

export class NotFoundError extends AppError {
    constructor(message: "Resources not found") {
        super(message, 404,);
    }
}
// validation error (usse for joi/zod/react-hook-form) validation errors
export class ValidationError extends AppError {
    constructor(message= "Invalid request Data", details?: any) {
        super(message, 400, true, details);
    }
}
// Authentication error 
export class AuthError extends AppError {
    constructor(message= "Authentication failed/unauthorized", details?: any) {
        super(message, 401, true, details);
    }
}
// forbidden error for insufficient permissions
export class ForbiddenError extends AppError {
    constructor(message= "Forbidden access", details?: any) {
        super(message, 403, true, details);
    }
}