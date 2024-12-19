import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { Category } from "../model/category.model";
import { ApiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";

export const handleAddCategory = asyncHandler(async (req: Request, res: Response) => {
    // Add category logic here
    const { name, slug, description, image } = req.body;
    if (!name || !slug || !description || !image) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const category = await Category.create({name, slug, description, image})
        return res.status(201).json( new ApiResponse(201, category, 'Category created successfully'));
    } catch (error) {
        return new ApiError(500, 'Internal server error');
        
    }
    
})