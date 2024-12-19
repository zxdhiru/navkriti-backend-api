import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const status = ['active', 'inactive', 'blocked'];

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: status,
        required: true,
        default: 'inactive',
    }
}, {timestamps: true});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 12);
    next();
})

UserSchema.methods.comparePassword = async function(plaintext : string) {
    return bcrypt.compareSync(plaintext, this.password);
}

export const User = mongoose.model('User', UserSchema);