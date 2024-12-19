import { Request, Response, NextFunction } from "express";
import { Product } from "../model/product.model";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const handleAddProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, description, price, discountedPrice, category, tags, stock, attributes } = req.body;
    console.log(req.body);

    // Validate the required fields
    if (!name || !slug || !description || !price || !discountedPrice || !category || !tags || !stock || !attributes) {
        console.log('All fields are required');
        return next(new ApiError(400, 'All fields are required'));
    }

    // Create product
    try {
        const product = await Product.create({ name, slug, description, price, discountedPrice, category, tags, stock, attributes });

        console.log(product);

        // Respond with a success message
        return res.status(201).json(new ApiResponse(201, product, "Product added successfully"));
    } catch (error: any) {
        new ApiError(500, error.message); // Pass the error to global error handler
    }
});
