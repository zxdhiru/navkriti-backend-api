interface IApiError extends Error {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;
    errors: any[];
}

class ApiError extends Error implements IApiError {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;
    errors: any[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
