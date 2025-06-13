import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

interface OtpDocument extends Document {
    compareOtp(otp: number): Promise<boolean>;
    expiresAt: Date;
}

const otpSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            reqired: true,
        },
    },
    { timestamps: true }
);

otpSchema.pre("save", async function (next) {
    try {
        // Check if OTP is modified
        if (!this.isModified("otp")) {
            return next();
        }

        // Ensure OTP is a string before hashing
        if (typeof this.otp !== "string") {
            throw new Error("OTP must be a string");
        }

        // Hash the OTP
        this.otp = await bcrypt.hash(this.otp, 12);
        next();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        next(error); // Pass error to next middleware
    }
});

otpSchema.methods.compareOtp = async function (otp: string) {
    return bcrypt.compareSync(otp, this.otp);
};

export const OTP = model<OtpDocument>("OTP", otpSchema);
