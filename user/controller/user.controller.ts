import { Request, Response } from "express";
import { User, UserDocument } from "../model/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import {
    refreshTokenOptions,
    accessTokenOptions,
    UserRequest,
    clearCookieOptions,
} from "../../utils/constants";
import nodemailer from "nodemailer";
import generateAccessAndRefreshTokens from "../../utils/generateToken";
import { OTP } from "../model/otp.model";
import { otpEmailTemplate } from "../../utils/otpTemplate";
import { welcomeTemplate } from "../../utils/welcomeTemplate";

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // Hostinger's SMTP host
    port: 465, // Use 587 for TLS
    secure: true, // True for 465, false for other ports
    auth: {
        user: `${process.env.EMAIL_ID}`, // Your Hostinger email address
        pass: `${process.env.EMAIL_PASSWORD}`, // Your Hostinger email password
    },
});

export const handleUserSignup = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, email, phone, password } = req.body;
        console.log(req.body);

        // Validate input fields
        if (!name || !email || !phone || !password) {
            throw new ApiError(400, "All fields are required");
        }

        // Check if the user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }],
        });
        if (existingUser) {
            return res.status(400).json(new ApiResponse(400, {}, "User already exists"));
        }

        try {
            // Create a new user
            const user = await User.create({
                name,
                email,
                phone,
                password,
            });

            // Generate OTP
            const generatedOTP = Math.floor(1000 + Math.random() * 9000);
            console.log("Generated OTP:", generatedOTP);

            // Store OTP in database
            await OTP.create({
                userId: user._id,
                otp: generatedOTP,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            });

            // Send OTP via email
            const mailOptions = {
                from: '"ZXDHIRU" <zxdhiru.dev@alljobguider.in>',
                to: email,
                subject: "OTP Verification",
                html: otpEmailTemplate(generatedOTP),
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    throw new ApiError(500, "Failed to send OTP email");
                } else {
                    console.log("Email sent:", info.response);
                }
            });

            // Generate access and refresh tokens
            const { accessToken, refreshToken } =
                await generateAccessAndRefreshTokens(user._id);

            // Return success response with cookies
            return res
                .status(201)
                .cookie("refreshToken", refreshToken, refreshTokenOptions)
                .cookie("accessToken", accessToken, accessTokenOptions)
                .json(
                    new ApiResponse(
                        200,
                        {},
                        "User created successfully. OTP sent to your email."
                    )
                );
        } catch (error: any) {
            console.error(error);
            throw new ApiError(500, "Internal Server Error");
        }
    }
);

export const handleVerifyUser = asyncHandler(
    async (req: Request & UserRequest, res: Response) => {
        const dbDbser = await User.findById(req.user._id).select("-password -refreshToken -role -status"); // Retrieve authenticated user

        // Validate user existence
        if (!dbDbser) {
            throw new ApiError(404, "User not found.");
        }

        const { otp } = req.body; // Extract OTP from the request body

        // Validate input
        if (!otp) {
            throw new ApiError(400, "OTP is required");
        }

        // Fetch the saved OTP for the user
        const savedOTP = await OTP.findOne({ userId: dbDbser._id });
        if (!savedOTP) {
            throw new ApiError(404, "OTP not found. Please request a new one.");
        }

        // Check if OTP has expired
        if (savedOTP.expiresAt <= new Date()) {
            throw new ApiError(
                400,
                "OTP has expired. Please request a new one."
            );
        }

        // Compare the provided OTP with the stored hashed OTP
        const isOTPValid = await savedOTP.compareOtp(otp);
        if (!isOTPValid) {
            throw new ApiError(400, "Invalid OTP.");
        }

        // Update user status to active
        await User.findByIdAndUpdate(dbDbser._id, { status: "active" });

        // Delete the OTP after successful verification
        await OTP.findByIdAndDelete(savedOTP._id);

        // send welcome email
        const mailOptions = {
            from: '"ZXDHIRU" <zxdhiru.dev@alljobguider.in>',
            to: dbDbser.email,
            subject: "Welcome to ZXDHIRU",
            html: welcomeTemplate(dbDbser?.name, "https://zxdhiru.com"),
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log("Welcome email sent:", info.response);
            }
        });

        // Return success response
        res.status(200).json(
            new ApiResponse(
                200,
                dbDbser,
                "OTP verified successfully. Your account is now active."
            )
        );
    }
);

export const handleUserLogin = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found with this email");
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ApiError(401, "Invalid credentials");
        }

        // Generate access token and refresh token
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to the database
        user.refreshToken = refreshToken;
        await user.save();

        const sendUserData = await User.findById(user._id).select("-password -refreshToken")

        // Return success response
        res.status(200)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .cookie("accessToken", accessToken, accessTokenOptions);
        res.json(
            new ApiResponse(
                200,
                sendUserData,
                "Login successful"
            )
        );
    }
);

export const handleUserLogout = asyncHandler(
    async (req: UserRequest, res: Response) => {
        // Clear refresh token from the database
        console.log(req.user);

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1, // this removes the field from document
                },
            },
            {
                new: true,
            }
        );
        return res
            .status(200)
            .clearCookie('accessToken', clearCookieOptions)
            .clearCookie("refreshToken", clearCookieOptions)
            .json(new ApiResponse(200, {}, "User logged Out"));
    }
);

export const handleGetAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
        const users = await User.find();
        res.status(200).json(
            new ApiResponse(200, users, "All users fetched successfully")
        );
    }
);

export const handleGetUserProfile = asyncHandler(
    async (req: Request & UserRequest, res: Response) => {
        const userId = req.user._id;
        const user = await User.findById(userId).select(
            "-password -refreshToken"
        );
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        // })
        res.status(200).json(
            new ApiResponse(200, user, "User fetched successfully")
        );
    }
);

export const handleGetSingleUser = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.params.id;
        const user = await User.findById(userId).select(
            "-password -refreshToken"
        );
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        res.status(200).json(
            new ApiResponse(200, user, "User fetched successfully")
        );
    }
);

export const handleRefreshToken = asyncHandler(
    async (req: Request & UserRequest, res: Response) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw new ApiError(401, "Cannot find refresh token");
        }

        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                throw new ApiError(404, "User not found");
            }
            const newAccessToken = user.generateAccessToken();
            res.cookie("accessToken", newAccessToken, accessTokenOptions);
            res.status(200).json(
                new ApiResponse(
                    200,
                    { accessToken: newAccessToken },
                    "Token refreshed successfully"
                )
            );
        } catch (error: any) {
            throw new ApiError(500, "Internal Server Error");
        }
    }
);
