import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    images: {
        type: [String]
    }
}, { timestamps: true });

export const Review = model('Review', reviewSchema);