import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserRequest } from "../../utils/constants";
import { Product } from "../../products/model/product.model";
import { ApiResponse } from "../../utils/apiResponse";
import { Cart } from "../model/cart.model";

export const handleAddToCart = asyncHandler(async (req: Request & UserRequest, res: Response) => {
    const user = req.user;
    
    const { productId, quantity = 1 } = req.body; 

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json(new ApiResponse(404, {}, "Product not found"));
    }

    // Get or create user's cart
    let userCart = await Cart.findOne({ userId: user._id });
    if (!userCart) {
        userCart = await Cart.create({
            userId: user._id,
            items: [{ productId, quantity, price: product.price }]
        });
        return res.status(201).json(
            new ApiResponse(201, userCart, "Product added to cart successfully")
        );
    }

    // Check if the product is already in the cart
    const existingProduct = userCart.items.find(
        (item) => item.productId.toString() === productId
    );
    if (existingProduct) {
        // Update the quantity
        existingProduct.quantity += quantity;
    } else {
        // Add the product to the cart
        userCart.items.push({ productId, quantity, price: product.price });
    }

    await userCart.save();

    return res.status(200).json(
        new ApiResponse(200, userCart, "Product updated in the cart successfully")
    );
});
