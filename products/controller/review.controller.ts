import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Review } from "../model/review.model";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { UserRequest } from "../../utils/constants";
import { Product } from "../model/product.model";

export const handlePostReview = asyncHandler(async (req: Request & UserRequest, res: Response) => {
    const userId = req.user._id;
    const { slug } = req.params;
    const { rating, review, images } = req.body;
    if (!rating || !review) {
        return res.status(400).json({ message: 'Rating and review are required' });
    }
    const product = await Product.findOne({slug})
    try {
        const userReview = await Review.create({ productId:product?._id, userId, rating, review, images });
        return res.status(201)
            .json(new ApiResponse(201, userReview, 'Review posted successfully'));
    } catch (error) {
        return new ApiError(500, 'Internal server error');
    }
})