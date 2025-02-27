export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const createHttpError = (statusCode: number, message: string) => {
    return new HttpError(message, statusCode);
};