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
        images: {
            type: [String],
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
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

// Pre-save hook to generate slug if not provided
productSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().split(" ").join("-"); // Generate slug from name
    }
    next();
});

// Indexing for fast queries
productSchema.index({ slug: 1, category: 1, isActive: 1 });

// Model creation
const Product = model('Product', productSchema);

export { Product };
