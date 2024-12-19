import { model, Schema } from "mongoose";

// Product schema definition
const productSchema = new Schema(
    {
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
        price: {
            type: Number,
            required: true,
        },
        discountedPrice: {
            type: Number,
            required: true
        },
        // images: {
        //     type: [String],
        //     required: true,
        // },
        category: {
            // type: Schema.Types.ObjectId,
            // ref: 'Category',
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        attributes: {
            type: Object,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

productSchema.index({ slug: 1, category: 1, isActive: 1 });

// Model creation
const Product = model('Product', productSchema);

export { Product };
