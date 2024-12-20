import { Schema, model } from "mongoose";

const wishlistSchema = new Schema({
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
                }
            }
        ],
        default: [] // Default to an empty array
    }
})

export const Wishlist = model('Wishlist', wishlistSchema);