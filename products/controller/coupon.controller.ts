import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Coupon } from "../model/coupon.model";
import { ApiResponse } from "../../utils/apiResponse";
import { UserRequest } from "../../utils/constants";
import { ApiError } from "../../utils/apiError";

export const handleAddCoupon = asyncHandler(
    async (req: Request, res: Response) => {
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            startDate,
            expiresAt,
            isActive,
            usageLimit,
        } = req.body;
        if (
            !code ||
            !description ||
            !discountType ||
            !discountValue ||
            !minOrderValue ||
            !maxDiscount ||
            !startDate ||
            !expiresAt ||
            !isActive ||
            !usageLimit
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const coupon = await Coupon.create({
            code,
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            startDate,
            expiresAt,
            isActive,
            usageLimit,
        });
        return res
            .status(201)
            .json(new ApiResponse(201, coupon, "Coupon created successfully"));
    }
);

export const handleValidateCoupon = asyncHandler(async (req: Request & UserRequest, res: Response) => {
    const { code, totalAmount } = req.body;
  
    // Validate inputs
    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }
    if (totalAmount === undefined || totalAmount < 0) {
      return res.status(400).json({ message: "Total amount is required and must be a positive number" });
    }
  
    try {
      // Fetch coupon
      const coupon = await Coupon.findOne({ code });
      if (!coupon) {
        return res.status(404).json({ message: "Coupon is not valid" });
      }
  
      // Check coupon validity
      if (coupon.expiresAt < new Date()) {
        return res.status(400).json({ message: "Coupon has expired" });
      }
  
      if (coupon.usageLimit <= coupon.usageCount) {
        return res.status(400).json({ message: "Coupon has reached its usage limit" });
      }
  
      if (coupon.minOrderValue > totalAmount) {
        return res.status(400).json({ message: "Minimum order value not met" });
      }
  
      // Calculate discount
      let discountAmount = 0;
      let couponDiscount = 0;
  
      if (coupon.discountType === "percentage") {
        couponDiscount = (coupon.discountValue / 100) * totalAmount;
      } else {
        couponDiscount = coupon.discountValue;
      }
  
      discountAmount = Math.min(couponDiscount, coupon.maxDiscount);
  
      // Respond with discount details
      return res.status(200).json( new ApiResponse(200, { discountAmount }, "Coupon is valid"));
    } catch (error) {
      // Handle database or unexpected errors
      console.error("Error validating coupon:", error);
      return new ApiError(500, "An error occurred while validating coupon");
    }
  });