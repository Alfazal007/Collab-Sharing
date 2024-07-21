class ApiError<T> extends Error {
    statusCode: number;
    message: string;
    success: boolean;
    data: string;
    errors: any; // need to be updated
    errorObject: T;
    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors = [],
        errorObject: T,
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = message;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.errorObject = errorObject;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
