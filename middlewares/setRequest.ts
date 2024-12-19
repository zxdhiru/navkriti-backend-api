import { Request, NextFunction, Response } from "express";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";

// Type for the decoded JWT payload
interface DecodedToken {
    _id: string;
    email: string;
}
// Middleware to set the user from the access token
export const setRequestUser = (req: Request & any, _: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    
    if (!accessToken) {
        return next(new ApiError(401, "Unauthorized"));
    }

    try {
        // Verify and decode the access token
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as DecodedToken;
        req.user = decoded; // Set the decoded user data to req.user
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return next(new ApiError(401, "Invalid or expired token"));
    }
};