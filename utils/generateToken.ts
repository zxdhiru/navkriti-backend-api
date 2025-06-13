import mongoose from "mongoose";
import { User } from "../user/model/user.model";
import { ApiError } from "./apiError";

// generate access token & refresh token for user
const generateAccessAndRefreshTokens = async (
    userId: mongoose.Types.ObjectId
) => {
    try {
        const user = await User.findById(userId);
        if (user === null) {
            throw new ApiError(404, "User not found");
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error: any) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Error generating tokens");
    }
};
export default generateAccessAndRefreshTokens;
