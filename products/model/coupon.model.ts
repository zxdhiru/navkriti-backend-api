import {Schema, model} from "mongoose";

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: [0, 'Discount value cannot be negative']
    },
    minOrderValue: {
        type: Number,
        required: true,
        min: [0, 'Minimum order value cannot be negative']
    },
    maxDiscount: {
        type: Number,
        required: true,
        min: [0, 'Maximum discount cannot be negative']
    },
    startDate: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        required: true,
        min: [0, 'Usage limit cannot be negative']
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

export const Coupon = model('Coupon', couponSchema);