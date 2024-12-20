import {Schema, model } from 'mongoose'

const addressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    alternatePhone: {
        type: Number,
    },
    pinCode: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    typeOfAddress: {
        type: String,
        enum: ['home', 'work'],
        default: 'home'
    }
})

export const Address = model("Address", addressSchema)