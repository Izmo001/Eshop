export  class AppError extends  Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(message: string, statusCode: number, isOperational = true, details?: any){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace(this);
    }
}
 
//Not found error
export class NotFoundError extends AppError{
    constructor(message = "resource not found"){
        super(message, 404);
    }
}

//validation error ( use for joi/react-hook-form for validation)
export class validationError extends AppError{
    constructor (message = "invalid request data ", details?:any){
        super(message, 400, true, details)
    }
}

//Authentication Error
export class AuthError extends AppError{
    constructor(message = "Unauthorized Access"){
        super(message, 401);
    }
}

//Forbidden Error( for Insufficient permisions)
export class ForbiddenError extends AppError{
    constructor(message = "forbidden Access"){
        super(message, 403);
    }
}
//Database Error (for MongoDb/postgres Errors)
export class DatabaseError extends AppError{
    constructor(message ="database error", details?:any){
    super(message, 500, true, details);
    }   
}

//Rate-limit Error
export class RateLimiter extends AppError{
    constructor(message = "Too many requests, please try again later"){
        super(message, 403);
    }
}