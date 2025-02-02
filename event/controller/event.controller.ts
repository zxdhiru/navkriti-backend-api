import { User, UserDocument } from "../../user/model/user.model";
import { ApiError } from "../../utils/apiError";
import { ApiResponse } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { UserRequest } from "../../utils/constants";
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
        const event = await Event.findOne({ slug });
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
