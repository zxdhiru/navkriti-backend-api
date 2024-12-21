import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const status = ['active', 'inactive', 'blocked'];
const role = ['user', 'admin'];

interface UserDocument extends Document {
    email: string;
    refreshToken?: string;
    comparePassword(candidatePassword: string): Promise<boolean>
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
}

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
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: role,
        default: 'user',
    },
    status: {
        type: String,
        enum: status,
        required: true,
        default: 'inactive',
    },
    refreshToken: {
        type: String,
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
UserSchema.methods.generateAccessToken = function() {
    return jwt.sign({ _id: this._id,  role: this.role  }, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
}
UserSchema.methods.generateRefreshToken = function() {
    return jwt.sign({ _id: this._id, role: this.role }, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
}
const User = mongoose.model<UserDocument>('User', UserSchema);
export { User, UserDocument };