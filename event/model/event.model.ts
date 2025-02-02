import mongoose, { Schema } from "mongoose";

interface EventDocument extends Document {
    name: string;
    description: string;
    date: Date;
    entryFee: number;
    prizes: string;
    participants: string[];
    coverPic: string;
    tagline: string;
    slug: string;
}
// {name, description, date, entryFee, prizes, participants, coverPic, tagline, slug}
const EventSchema = new Schema({
    name: {
        type: String,
        required: true,

    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    tagline: {
        type: String,
        required: true,
    },
    coverPic: {
        type: String,
        required: true,
        default: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
    },
    participants: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    entryFee: {
        type: Number,
        required: true,
    },
    prizes: {
        type: String,
        required: true,
    },
}, {timestamps: true});



const Event = mongoose.model<EventDocument>('Event', EventSchema);
export { Event, EventDocument };