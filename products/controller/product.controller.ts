import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";
import { Product } from "../model/product.model";
import { ApiResponse } from "../../utils/apiResponse";

export const handleAddProdoct = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, discountedPrice, images, category, tags, stock, attributes, isActive } = req.body;
    if (!name || !description || !price || !discountedPrice || !images || !category || !tags || !stock || !attributes || !isActive) {
        return new ApiError(400, 'All fields are required');
    }
    // Create product
    const product = await Product.create({name, description, price, discountedPrice, images, category, tags, stock, attributes, isActive});
    return res.status(201).json(new ApiResponse(200, product, "Product added successfully"))
})