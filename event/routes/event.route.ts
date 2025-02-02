import { Router } from "express";
import { checkForAdmin, setRequestUser } from "../../middlewares/setRequest";
import { handleCreateEvent, handleGetAllEvents, handleGetSingleEvent, handleParticipateEvent, handleUpdateEvent } from "../controller/event.controller";

const EventRouter = Router();

// Route for user registration
EventRouter.get("/",handleGetAllEvents);
EventRouter.get("/:slug", handleGetSingleEvent);
EventRouter.post("/create",setRequestUser,checkForAdmin,handleCreateEvent);
EventRouter.post("/participate",setRequestUser,handleParticipateEvent);
EventRouter.patch("/:slug",setRequestUser,checkForAdmin, handleUpdateEvent);

export default EventRouter;