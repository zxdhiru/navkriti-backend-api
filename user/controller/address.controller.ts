import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserRequest } from "../../utils/constants";
import { Address } from "../model/address.model";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";

export const handleAddAddress = asyncHandler(
    async (req: Request & UserRequest, res: Response) => {
        const user = req.user;
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

        if(!fullName || !phone || !pinCode || !state || !city || !street || !locality) {
            return res.status(400).json({ message: "Missing required fields" });
        }
                // Create address
                try {
                    const address = await Address.create({userId: user._id, fullName, phone, alternatePhone, pinCode, state, city, street, locality, landmark, typeOfAddress});
        return res.status(201).json(new ApiResponse(201, address, "Address added successfully"));
                } catch (err) {
                    return res
                        .status(500)
                        .json(new ApiError(500,  "Failed to add address"));
                }
        
        
    }
);
