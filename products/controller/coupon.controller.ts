import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Coupon } from "../model/coupon.model";
import { ApiResponse } from "../../utils/apiResponse";

export const handleAddCoupon = asyncHandler(async (req: Request, res: Response) => {
    const {code, description, discountType, discountValue, minOrderValue, maxDiscount, startDate, expiresAt, isActive, usageLimit} = req.body;
    if(!code || !description || !discountType || !discountValue || !minOrderValue || !maxDiscount || !startDate || !expiresAt || !isActive || !usageLimit) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const coupon = await Coupon.create({code, description, discountType, discountValue, minOrderValue, maxDiscount, startDate, expiresAt, isActive, usageLimit});
    return res.status(201).json( new ApiResponse(201, coupon, 'Coupon created successfully'));
})