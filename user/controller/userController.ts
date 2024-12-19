import { Request, Response } from "express";
import { User } from "../model/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";




const handleUserSignup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;

    // Validate input fields
    if (!name || !email || !phone || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // Create a new user (exclude password in response)
    const user = await User.create({
        name,
        email,
        phone,
        password
    });
    const createdUser = await User.findById(user._id).select("-password");
    // Return success response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export default handleUserSignup;
