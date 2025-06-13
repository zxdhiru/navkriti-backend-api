import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const asyncHandler = (requestHandler: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>
            next(err)
        );
    };
};

export { asyncHandler };
