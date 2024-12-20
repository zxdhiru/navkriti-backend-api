import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Index for faster lookup by userId
    },
    items: {
        type: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1'] // Validation for minimum quantity
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, 'Price cannot be negative'] // Validation for non-negative price
                }
            }
        ],
        default: [] // Default to an empty array
    }
}, { timestamps: true });

// Virtual field to calculate the total price of the cart
cartSchema.virtual('totalPrice').get(function () {
    return this.items.reduce((total, item) => total + item.quantity * item.price, 0);
});

// Ensure virtual fields are included in JSON responses
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

export const Cart = model('Cart', cartSchema);