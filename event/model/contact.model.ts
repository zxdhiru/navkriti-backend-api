import { model, Schema } from "mongoose";

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Contact = model("Contact", ContactSchema);
export default Contact;