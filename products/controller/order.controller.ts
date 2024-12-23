import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserRequest } from "../../utils/constants";
import { ApiError } from "../../utils/apiError";
import { Order } from "../model/order.model";
import { ApiResponse } from "../../utils/apiResponse";
import { Product } from "../model/product.model";

export const handleCreateOrder = asyncHandler(async (req: Request & UserRequest, res: Response) => {
    const user = req.user;
    const { items, totalAmount, paymentMethod, address, coupon } = req.body;

    if (!items || !totalAmount || !paymentMethod || !address) {
        return res.status(400).json(new ApiError(400, "All fields are required!"));
    }

    try {
        const order = await Order.create({
            userId: user._id,
            items,
            totalAmount,
            paymentType: paymentMethod,
            address,
            coupon,
        });

        // Update product stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (product) {
                if (product.stock < item.quantity) {
                    return res
                        .status(400)
                        .json(
                            new ApiError(
                                400,
                                `Insufficient stock for product: ${product.name}`
                            )
                        );
                }
                product.stock -= item.quantity;
                await product.save();
            }
        }

        return res
            .status(201)
            .json(new ApiResponse(201, order, "Order placed successfully!"));
    } catch (error: any) {
        return res
            .status(500)
            .json(new ApiError(500, "Something went wrong while placing order!"));
    }
});