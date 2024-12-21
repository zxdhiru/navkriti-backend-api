import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs";

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        reqired: true
    }
}, {timestamps: true})

otpSchema.pre('save', function(next) {
    if (!this.isModified('otp')) {
        return next();
    }
    this.otp = bcrypt.hashSync(this.otp, 12);
    next();
})

otpSchema.methods.compareOtp = async function(otp : string) {
    return bcrypt.compareSync(otp, this.otp);
}

export const OTP = model("OTP", otpSchema)