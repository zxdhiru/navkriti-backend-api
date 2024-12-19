import {model, Schema} from 'mongoose';

// Category schema definition
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});

categorySchema.index({slug: 1, isActive: 1});

export const Category = model('Category', categorySchema);
