import { User, UserDocument } from "../../user/model/user.model";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserRequest } from "../../utils/constants";
import Contact from "../model/contact.model";
import { Event } from "../model/event.model";
import { Request, Response } from "express";

// handleGetAllEvents
export const handleGetAllEvents = asyncHandler(
    async (req: Request, res: Response) => {
        const events = await Event.find();
        if (!events || events.length === 0) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "No events found"));
        }
        res.status(200).json(
            new ApiResponse(200, events, "All events fetched successfully")
        );
    }
);
// handleGetSingleEvent
export const handleGetSingleEvent = asyncHandler(
    async (req: Request, res: Response) => {
        const { slug } = req.params;
        const event = await Event.findOne({ slug }).populate("participants");
        if (!event || event === null) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Event not found"));
        }
        res.status(200).json(
            new ApiResponse(200, event, "Event fetched successfully")
        );
    }
);
// handleCreateEvent
export const handleCreateEvent = asyncHandler(
    async (req: Request, res: Response) => {
        const {
            name,
            description,
            date,
            entryFee,
            prizes,
            tagline,
            coverPic,
            slug,
        } = req.body;
        if(!name || !description || !date || !entryFee || !prizes || !tagline || !coverPic || !slug) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "All fields are required"));
        }
        try {
            const eventExists = await Event.findOne({ slug });
            if (eventExists) {
                return res
                    .status(400)
                    .json(new ApiResponse(400, null, "Event already exists"));
            }
            const event = await Event.create({
                name,
                description,
                date,
                entryFee,
                prizes,
                tagline,
                coverPic,
                slug,
            });
            return res
                .status(201)
                .json(
                    new ApiResponse(201, event, "Event created successfully")
                );
        } catch (error) {
            console.error(error);
            throw new ApiError(500, "Internal Server Error");
        }
    }
);
// handleParticipateEvent
export const handleParticipateEvent = asyncHandler(
    async (req: UserRequest, res: Response) => {
        const { slug } = req.body as { slug?: string };
        if (!slug) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Slug is required"));
        }
        const { _id } = req.user;
        const event = await Event.findOne({ slug });
        const user = await User.findById(_id);
        if (!user) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "User not found"));
        }
        if (!event) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Event not found"));
        }
        event.participants.push(_id);
        await event.save();
        user.eventsParticipated.push(event._id);
        await user.save();
        res.status(200).json(
            new ApiResponse(200, event, "Event participated successfully")
        );
    }
);
// handleUpdateEvent
export const handleUpdateEvent = asyncHandler(
    async (req: Request, res: Response) => {
        const { slug } = req.params;
        const {
            name,
            description,
            date,
            entryFee,
            prizes,
            tagline,
            coverPic,
        } = req.body;
        const event = await Event.findOne({ slug });
        if (!event) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Event not found"));
        }
        event.name = name || event.name;
        event.description = description || event.description;
        event.date = date || event.date;
        event.entryFee = entryFee || event.entryFee;
        event.prizes = prizes || event.prizes;
        event.tagline = tagline || event.tagline;
        event.coverPic = coverPic || event.coverPic;
        await event.save();
        res.status(200).json(
            new ApiResponse(200, event, "Event updated successfully")
        );
    }
);
// handleContact
export const handleContact = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json(new ApiResponse(400, null, "Please provide a valid email"));
        }

        // Save the contact form submission to the database
        try {
            const entry = await Contact.create({ name, email, message });

            // Send a confirmation email to the admin (or an appropriate email)
            // await sendEmail({
            //     to: 'admin@example.com', // Admin email
            //     subject: 'New Contact Form Submission',
            //     text: `You have a new message from ${name} (${email}):\n\n${message}`,
            // });

            // Respond with success message
            res.status(200).json(
                new ApiResponse(200, null, "Contact form submitted successfully")
            );
        } catch (error: any) {
            console.error("Error in handleContact:", error);

            // More specific error logging for development purposes
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            // Send a generic error message to the client
            return res.status(500).json(new ApiError(500, "Internal Server Error"));
        }
    }
);