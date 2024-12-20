import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserRequest } from "../../utils/constants";
import { Product } from "../../products/model/product.model";
import { ApiError } from "../../utils/apiError";
import { Wishlist } from "../model/wishlist.model";
import { ApiResponse } from "../../utils/apiResponse";

export const handleAddToWishlist = asyncHandler(async (req: Request & UserRequest, res: Response) => {
    const user = req.user;
    const { productId } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        return new ApiError(404, "Product not found");
    }

    const userWishlist = await Wishlist.findOne({ userId: user._id });

    if (!userWishlist) {
        const wishlist = await Wishlist.create({
            userId: user._id,
            items: [{ productId }]
        });
        return res.status(201).json( new ApiResponse(201, wishlist, "Product added to wishlist successfully"));
    }
    const existingProduct = userWishlist.items.find((item) => item.productId.toString() === productId);
    if (existingProduct) {
        return new ApiError(400, "Product already in wishlist");
    }
    userWishlist.items.push({ productId });
    await userWishlist.save();
    return res.status(200).json( new ApiResponse(200, userWishlist, "Product added to wishlist successfully"));
    
})