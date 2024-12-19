import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Review } from "../model/review.model";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";

export const handlePostReview = asyncHandler(async (req: Request, res: Response) => {
    const { productId, userId } = req.params;
    const { rating, review, images } = req.body;
    if (!rating || !review) {
        return res.status(400).json({ message: 'Rating and review are required' });
    }
    try {
        const userReview = await Review.create({ productId, userId, rating, review, images });
        return res.status(201)
            .json(new ApiResponse(201, userReview, 'Review posted successfully'));
    } catch (error) {
        return new ApiError(500, 'Internal server error');
    }
})