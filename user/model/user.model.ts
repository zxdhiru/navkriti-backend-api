import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const status = ["active", "inactive", "blocked"];
const role = ["user", "admin"];

interface UserDocument extends Document {
    name: string;
    email: string;
    eventsParticipated: mongoose.Types.ObjectId[];
    refreshToken?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAccessToken: () => string;
    generateRefreshToken: () => string;
    save: () => Promise<UserDocument>;
}
// {name, email, phone, password, department, session, studentId, profilePic}

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
            enum: ["CSE", "ME", "ECE", "EE", "CE"],
        },
        session: {
            type: String,
            required: true,
            enum: ["2024-2028", "2023-2027", "2022-2026", "2021-2025"],
        },
        studentId: {
            type: Number,
            required: true,
        },
        profilePic: {
            type: String,
            default:
                "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png",
        },
        eventsParticipated: {
            type: [Schema.Types.ObjectId],
            ref: "Event",
            default: [],
        },
        role: {
            type: String,
            enum: role,
            default: "user",
        },
        status: {
            type: String,
            enum: status,
            required: true,
            default: "inactive",
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 12);
    next();
});

UserSchema.methods.comparePassword = async function (plaintext: string) {
    return bcrypt.compareSync(plaintext, this.password);
};
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role, status: this.status },
        `${process.env.ACCESS_TOKEN_SECRET}`,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
};
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, role: this.role, status: this.status },
        `${process.env.REFRESH_TOKEN_SECRET}`,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
};
const User = mongoose.model<UserDocument>("User", UserSchema);
export { User, UserDocument };
