import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserRequest } from "../../utils/constants";
import { Address } from "../model/address.model";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";

export const handleAddAddress = asyncHandler(
    async (req: Request & UserRequest, res: Response) => {
        const { user } = req;;
        
        const {
            fullName,
            phone,
            alternatePhone,
            pinCode,
            state,
            city,
            street,
            locality,
            landmark,
            typeOfAddress,
        } = req.body;
        
        // Validate required fields
        if (
            !fullName ||
            !phone ||
            !pinCode ||
            !state ||
            !city ||
            !street ||
            !locality
        ) {
            throw new ApiError(400, "Missing required fields");
        }

        // Attempt to create address
        try {
            const address = await Address.create({
                userId: user._id,
                fullName,
                phone,
                alternatePhone,
                pinCode,
                state,
                city,
                street,
                locality,
                landmark,
                typeOfAddress,
            });

            // Respond with success
            res.status(201).json(
                new ApiResponse(201, address, "Address added successfully")
            );
        } catch (err: any) {
            // Handle unexpected server errors
            throw new ApiError(500, "Failed to add address");
        }
    }
);
