import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";
import { Messages } from "../constants/messageConstants";
import { HttpStatus } from "../constants/statusContstants";

export const errorHandler = (err: HttpError | Error, req: Request, res: Response, next: NextFunction) => {
    console.log("Error caught in ERROR MIDDLEWARE :", err); // Debugging
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR || 500
    let message = Messages.SERVER_ERROR

    if (err instanceof HttpError) {
        statusCode = err.statusCode
        message = err.message
    } else {
        console.log('Unhanled', err);
    }
    res.status(statusCode).json({error: message})
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new HttpError(Messages.INVALID_REQUEST, HttpStatus.NOT_FOUND))
};