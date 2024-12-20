import {Schema , model} from 'mongoose';

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
                    min: [1, 'Quantity cannot be less than 1']
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, 'Price cannot be negative']
                }
            }
        ],
        required: true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    paymentType: {
        type: String,
        enum: ['card', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'failed', 'success'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['placed', 'packed', 'shipped', 'delivered'],
        default: 'placed'
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon'
    }
}, {timestamps: true});

export const Order = model("Order", orderSchema)